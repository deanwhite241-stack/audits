export interface AuditModule {
  id: string;
  name: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  description: string;
  analyze: (sourceCode: string, contractAddress: string, bytecode?: string) => Promise<ModuleResult>;
}

export interface ModuleResult {
  passed: boolean;
  score: number; // 0-100
  issues: Issue[];
  recommendations: string[];
  details: string;
  gasImpact?: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export interface Issue {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  description: string;
  location?: string;
  code?: string;
  fix?: string;
}

// Gas Optimization Analysis Module
export const gasOptimizationModule: AuditModule = {
  id: 'gas-optimization',
  name: 'Gas Optimization Analysis',
  category: 'Performance',
  severity: 'MEDIUM',
  description: 'Analyzes functions for expensive operations and gas optimization opportunities',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;
    
    // Check for expensive operations
    const expensivePatterns = [
      { pattern: /for\s*\([^)]*;\s*[^;]*\.length\s*;/g, issue: 'Loop with array.length in condition', severity: 'MEDIUM' as const },
      { pattern: /storage\s+\w+\[\]\s+\w+/g, issue: 'Dynamic storage array usage', severity: 'HIGH' as const },
      { pattern: /string\s+memory\s+\w+\s*=\s*""/g, issue: 'Empty string initialization', severity: 'LOW' as const },
      { pattern: /\+\+\w+/g, issue: 'Pre-increment usage (good)', severity: 'INFO' as const },
      { pattern: /\w+\+\+/g, issue: 'Post-increment usage (less efficient)', severity: 'LOW' as const },
    ];

    expensivePatterns.forEach(({ pattern, issue, severity }) => {
      const matches = sourceCode.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            type: 'gas-optimization',
            severity,
            description: issue,
            code: match,
            fix: severity === 'LOW' && match.includes('++') ? 'Use pre-increment (++i) instead of post-increment (i++)' : undefined
          });
          if (severity === 'HIGH') score -= 15;
          else if (severity === 'MEDIUM') score -= 10;
          else if (severity === 'LOW') score -= 5;
        });
      }
    });

    // Check for storage optimization
    if (sourceCode.includes('mapping') && sourceCode.includes('struct')) {
      const structPackingCheck = /struct\s+\w+\s*{[^}]*}/g;
      const structs = sourceCode.match(structPackingCheck);
      if (structs) {
        structs.forEach(struct => {
          if (struct.includes('uint256') && struct.includes('bool')) {
            issues.push({
              type: 'gas-optimization',
              severity: 'MEDIUM',
              description: 'Struct packing optimization possible',
              code: struct,
              fix: 'Pack smaller types together to save storage slots'
            });
            score -= 10;
          }
        });
      }
    }

    return {
      passed: score >= 70,
      score,
      issues,
      recommendations: [
        'Use pre-increment (++i) instead of post-increment (i++)',
        'Cache array length in loops',
        'Pack struct variables efficiently',
        'Use immutable for constants',
        'Consider using bytes32 instead of string for fixed-length data'
      ],
      details: `Gas optimization analysis found ${issues.length} potential improvements`,
      gasImpact: issues.length * 1000,
      riskLevel: score < 50 ? 'HIGH' : score < 70 ? 'MEDIUM' : 'LOW'
    };
  }
};

// Reentrancy Attack Detection Module
export const reentrancyModule: AuditModule = {
  id: 'reentrancy-detection',
  name: 'Reentrancy Attack Detection',
  category: 'Security',
  severity: 'CRITICAL',
  description: 'Detects potential reentrancy vulnerabilities in external calls',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;

    // Check for external calls without reentrancy guards
    const externalCallPatterns = [
      /\w+\.call\s*\(/g,
      /\w+\.transfer\s*\(/g,
      /\w+\.send\s*\(/g,
      /\w+\.delegatecall\s*\(/g
    ];

    const hasReentrancyGuard = /nonReentrant|ReentrancyGuard/i.test(sourceCode);
    const hasChecksEffectsInteractions = /require\s*\([^)]*\)\s*;[\s\S]*?=[\s\S]*?\.call/g.test(sourceCode);

    externalCallPatterns.forEach(pattern => {
      const matches = sourceCode.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const functionContext = extractFunctionContext(sourceCode, match);
          const hasGuard = functionContext.includes('nonReentrant') || functionContext.includes('ReentrancyGuard');
          
          if (!hasGuard) {
            issues.push({
              type: 'reentrancy',
              severity: 'CRITICAL',
              description: `Unguarded external call: ${match}`,
              code: match,
              location: functionContext.split('\n')[0],
              fix: 'Add nonReentrant modifier or implement checks-effects-interactions pattern'
            });
            score -= 20;
          }
        });
      }
    });

    // Check for state changes after external calls
    const stateChangeAfterCall = /\.call[\s\S]*?=\s*\w+/g.test(sourceCode);
    if (stateChangeAfterCall && !hasReentrancyGuard) {
      issues.push({
        type: 'reentrancy',
        severity: 'HIGH',
        description: 'State changes after external calls detected',
        fix: 'Move state changes before external calls or add reentrancy protection'
      });
      score -= 15;
    }

    return {
      passed: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      score,
      issues,
      recommendations: [
        'Use OpenZeppelin ReentrancyGuard',
        'Follow checks-effects-interactions pattern',
        'Move state changes before external calls',
        'Use pull payment pattern for withdrawals'
      ],
      details: `Reentrancy analysis found ${issues.length} potential vulnerabilities`,
      riskLevel: issues.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' : 'MEDIUM'
    };
  }
};

// Integer Overflow/Underflow Checks Module
export const integerOverflowModule: AuditModule = {
  id: 'integer-overflow',
  name: 'Integer Overflow/Underflow Checks',
  category: 'Security',
  severity: 'HIGH',
  description: 'Checks for integer overflow/underflow vulnerabilities',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;

    // Check Solidity version
    const versionMatch = sourceCode.match(/pragma\s+solidity\s+([^;]+);/);
    const version = versionMatch ? versionMatch[1] : '';
    const isPost08 = version.includes('0.8') || version.includes('^0.8');

    // Check for SafeMath usage in pre-0.8.0
    const hasSafeMath = /SafeMath|using\s+SafeMath/i.test(sourceCode);
    const hasArithmetic = /[\+\-\*\/]\s*=|=\s*[\w\s]*[\+\-\*\/]/.test(sourceCode);

    if (!isPost08 && hasArithmetic && !hasSafeMath) {
      issues.push({
        type: 'integer-overflow',
        severity: 'CRITICAL',
        description: 'Arithmetic operations without SafeMath in pre-0.8.0 Solidity',
        fix: 'Use SafeMath library or upgrade to Solidity 0.8.0+'
      });
      score -= 30;
    }

    // Check for unchecked blocks in 0.8.0+
    const uncheckedBlocks = sourceCode.match(/unchecked\s*{[^}]*}/g);
    if (uncheckedBlocks && isPost08) {
      uncheckedBlocks.forEach(block => {
        if (block.includes('+') || block.includes('-') || block.includes('*')) {
          issues.push({
            type: 'integer-overflow',
            severity: 'HIGH',
            description: 'Unchecked arithmetic operations',
            code: block,
            fix: 'Ensure arithmetic operations in unchecked blocks are safe'
          });
          score -= 15;
        }
      });
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /\w+\s*\-\s*\w+\s*(?!>=|>)/g, issue: 'Potential underflow in subtraction' },
      { pattern: /\w+\s*\*\s*\w+\s*(?!\s*\/)/g, issue: 'Potential overflow in multiplication' }
    ];

    if (!isPost08 && !hasSafeMath) {
      dangerousPatterns.forEach(({ pattern, issue }) => {
        const matches = sourceCode.match(pattern);
        if (matches) {
          matches.forEach(match => {
            issues.push({
              type: 'integer-overflow',
              severity: 'MEDIUM',
              description: issue,
              code: match
            });
            score -= 10;
          });
        }
      });
    }

    return {
      passed: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      score,
      issues,
      recommendations: [
        isPost08 ? 'Review unchecked blocks carefully' : 'Use SafeMath library',
        'Upgrade to Solidity 0.8.0+ for built-in overflow protection',
        'Add bounds checking for user inputs',
        'Use require statements for critical arithmetic'
      ],
      details: `Integer overflow analysis completed. Solidity version: ${version}`,
      riskLevel: issues.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' : 'MEDIUM'
    };
  }
};

// Access Control & Permission Analysis Module
export const accessControlModule: AuditModule = {
  id: 'access-control',
  name: 'Access Control & Permission Analysis',
  category: 'Security',
  severity: 'HIGH',
  description: 'Analyzes access control mechanisms and permission structures',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;

    // Check for access control modifiers
    const modifiers = sourceCode.match(/modifier\s+(\w+)\s*\([^)]*\)\s*{[^}]*}/g) || [];
    const functions = sourceCode.match(/function\s+(\w+)\s*\([^)]*\)\s*[^{]*{/g) || [];

    // Check for onlyOwner pattern
    const hasOwnable = /Ownable|onlyOwner/.test(sourceCode);
    const hasAccessControl = /AccessControl|hasRole/.test(sourceCode);

    // Check for unprotected critical functions
    const criticalFunctions = [
      'mint', 'burn', 'withdraw', 'transfer', 'approve', 'pause', 'unpause',
      'setOwner', 'transferOwnership', 'selfdestruct', 'destroy'
    ];

    functions.forEach(func => {
      const funcName = func.match(/function\s+(\w+)/)?.[1];
      if (funcName && criticalFunctions.some(cf => funcName.toLowerCase().includes(cf))) {
        const hasModifier = /onlyOwner|onlyRole|require\s*\(.*msg\.sender/.test(func);
        if (!hasModifier) {
          issues.push({
            type: 'access-control',
            severity: 'CRITICAL',
            description: `Unprotected critical function: ${funcName}`,
            code: func.split('{')[0],
            fix: 'Add appropriate access control modifier'
          });
          score -= 25;
        }
      }
    });

    // Check for role-based access control
    if (hasAccessControl) {
      const roleDefinitions = sourceCode.match(/bytes32\s+public\s+constant\s+\w+_ROLE/g);
      if (!roleDefinitions || roleDefinitions.length < 2) {
        issues.push({
          type: 'access-control',
          severity: 'MEDIUM',
          description: 'Limited role definitions in AccessControl',
          fix: 'Consider implementing granular role-based permissions'
        });
        score -= 10;
      }
    }

    // Check for centralization risks
    const ownerFunctions = functions.filter(f => f.includes('onlyOwner')).length;
    if (ownerFunctions > 5) {
      issues.push({
        type: 'access-control',
        severity: 'HIGH',
        description: `High centralization risk: ${ownerFunctions} owner-only functions`,
        fix: 'Consider implementing multi-sig or DAO governance'
      });
      score -= 15;
    }

    // Check for missing two-step ownership transfer
    if (hasOwnable && !sourceCode.includes('pendingOwner')) {
      issues.push({
        type: 'access-control',
        severity: 'MEDIUM',
        description: 'Missing two-step ownership transfer',
        fix: 'Implement two-step ownership transfer pattern'
      });
      score -= 10;
    }

    return {
      passed: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      score,
      issues,
      recommendations: [
        'Use OpenZeppelin AccessControl for role-based permissions',
        'Implement two-step ownership transfer',
        'Add multi-signature for critical operations',
        'Consider timelock for administrative functions',
        'Implement emergency pause mechanism'
      ],
      details: `Access control analysis found ${modifiers.length} modifiers and ${ownerFunctions} owner-only functions`,
      riskLevel: issues.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' : 'MEDIUM'
    };
  }
};

// Oracle Manipulation Risk Module
export const oracleManipulationModule: AuditModule = {
  id: 'oracle-manipulation',
  name: 'Oracle Manipulation Risk',
  category: 'DeFi Security',
  severity: 'HIGH',
  description: 'Identifies oracle dependencies and manipulation risks',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;

    // Check for oracle usage patterns
    const oraclePatterns = [
      /Chainlink|AggregatorV3Interface|latestRoundData/i,
      /getPrice|price|oracle/i,
      /Uniswap|getAmountsOut|getReserves/i,
      /TWAP|timeWeightedAverage/i
    ];

    let hasOracle = false;
    oraclePatterns.forEach(pattern => {
      if (pattern.test(sourceCode)) {
        hasOracle = true;
      }
    });

    if (hasOracle) {
      // Check for price validation
      const hasPriceValidation = /require\s*\([^)]*price|price\s*>\s*0|price\s*!=\s*0/.test(sourceCode);
      if (!hasPriceValidation) {
        issues.push({
          type: 'oracle-manipulation',
          severity: 'HIGH',
          description: 'Missing price validation from oracle',
          fix: 'Add price sanity checks and validation'
        });
        score -= 20;
      }

      // Check for single oracle dependency
      const oracleCount = (sourceCode.match(/latestRoundData|getPrice/gi) || []).length;
      if (oracleCount === 1) {
        issues.push({
          type: 'oracle-manipulation',
          severity: 'MEDIUM',
          description: 'Single oracle dependency creates centralization risk',
          fix: 'Implement multiple oracle sources or fallback mechanisms'
        });
        score -= 15;
      }

      // Check for TWAP usage
      const hasTWAP = /TWAP|timeWeighted|observe/.test(sourceCode);
      if (!hasTWAP && sourceCode.includes('Uniswap')) {
        issues.push({
          type: 'oracle-manipulation',
          severity: 'HIGH',
          description: 'Using spot price from DEX without TWAP protection',
          fix: 'Implement TWAP or use Chainlink oracles'
        });
        score -= 25;
      }

      // Check for staleness checks
      const hasStalenessCheck = /updatedAt|timestamp.*block\.timestamp/.test(sourceCode);
      if (!hasStalenessCheck) {
        issues.push({
          type: 'oracle-manipulation',
          severity: 'MEDIUM',
          description: 'Missing oracle data staleness checks',
          fix: 'Add timestamp validation for oracle data'
        });
        score -= 10;
      }

      // Check for circuit breakers
      const hasCircuitBreaker = /pause|emergency|circuit.*breaker/i.test(sourceCode);
      if (!hasCircuitBreaker) {
        issues.push({
          type: 'oracle-manipulation',
          severity: 'MEDIUM',
          description: 'Missing circuit breaker for oracle failures',
          fix: 'Implement emergency pause for oracle anomalies'
        });
        score -= 10;
      }
    }

    return {
      passed: issues.filter(i => i.severity === 'HIGH').length === 0,
      score,
      issues,
      recommendations: [
        'Use multiple oracle sources for price feeds',
        'Implement TWAP for DEX-based pricing',
        'Add price deviation limits and circuit breakers',
        'Validate oracle data freshness and staleness',
        'Consider using Chainlink Price Feeds for reliability'
      ],
      details: hasOracle ? `Oracle usage detected with ${issues.length} potential risks` : 'No oracle usage detected',
      riskLevel: issues.some(i => i.severity === 'HIGH') ? 'HIGH' : 'MEDIUM'
    };
  }
};

// Flash Loan Attack Analysis Module
export const flashLoanModule: AuditModule = {
  id: 'flash-loan-attack',
  name: 'Flash Loan Attack Analysis',
  category: 'DeFi Security',
  severity: 'CRITICAL',
  description: 'Analyzes vulnerability to flash loan attacks',
  analyze: async (sourceCode: string, contractAddress: string) => {
    const issues: Issue[] = [];
    let score = 100;

    // Check for flash loan interfaces
    const hasFlashLoan = /flashLoan|onFlashLoan|IERC3156|FlashBorrower/.test(sourceCode);
    
    // Check for balance-dependent logic
    const balanceChecks = sourceCode.match(/balanceOf\s*\([^)]*\)|\.balance/g) || [];
    const priceCalculations = sourceCode.match(/getAmountsOut|getReserves|price/gi) || [];

    if (balanceChecks.length > 0 || priceCalculations.length > 0) {
      // Check for single-block protection
      const hasBlockProtection = /block\.number|block\.timestamp/.test(sourceCode);
      if (!hasBlockProtection) {
        issues.push({
          type: 'flash-loan',
          severity: 'HIGH',
          description: 'Balance-dependent logic without block-based protection',
          fix: 'Add block.number or block.timestamp checks'
        });
        score -= 20;
      }

      // Check for commit-reveal or time delays
      const hasTimeDelay = /timelock|delay|commit.*reveal/i.test(sourceCode);
      if (!hasTimeDelay && balanceChecks.length > 2) {
        issues.push({
          type: 'flash-loan',
          severity: 'MEDIUM',
          description: 'Multiple balance checks without time delays',
          fix: 'Consider implementing time delays for critical operations'
        });
        score -= 15;
      }

      // Check for oracle price manipulation protection
      if (priceCalculations.length > 0) {
        const hasOracleProtection = /Chainlink|TWAP|timeWeighted/.test(sourceCode);
        if (!hasOracleProtection) {
          issues.push({
            type: 'flash-loan',
            severity: 'CRITICAL',
            description: 'Price calculations vulnerable to flash loan manipulation',
            fix: 'Use TWAP or external oracles instead of spot prices'
          });
          score -= 30;
        }
      }

      // Check for reentrancy protection in flash loan context
      if (hasFlashLoan) {
        const hasReentrancyGuard = /nonReentrant|ReentrancyGuard/.test(sourceCode);
        if (!hasReentrancyGuard) {
          issues.push({
            type: 'flash-loan',
            severity: 'CRITICAL',
            description: 'Flash loan implementation without reentrancy protection',
            fix: 'Add nonReentrant modifier to flash loan functions'
          });
          score -= 25;
        }
      }

      // Check for slippage protection
      const hasSlippageProtection = /slippage|minAmount|deadline/.test(sourceCode);
      if (priceCalculations.length > 0 && !hasSlippageProtection) {
        issues.push({
          type: 'flash-loan',
          severity: 'MEDIUM',
          description: 'Missing slippage protection in price-sensitive operations',
          fix: 'Add slippage limits and deadline checks'
        });
        score -= 10;
      }
    }

    return {
      passed: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      score,
      issues,
      recommendations: [
        'Use TWAP instead of spot prices for critical calculations',
        'Implement block-based or time-based delays',
        'Add reentrancy protection for flash loan functions',
        'Use external oracles for price feeds',
        'Implement slippage protection and deadlines'
      ],
      details: `Flash loan analysis found ${balanceChecks.length} balance checks and ${priceCalculations.length} price calculations`,
      riskLevel: issues.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' : 'MEDIUM'
    };
  }
};

// Helper function to extract function context
function extractFunctionContext(sourceCode: string, match: string): string {
  const index = sourceCode.indexOf(match);
  const before = sourceCode.substring(0, index);
  const functionStart = before.lastIndexOf('function');
  const after = sourceCode.substring(index);
  const functionEnd = after.indexOf('}') + index;
  
  return sourceCode.substring(functionStart, functionEnd + 1);
}

// Export all modules
export const auditModules = [
  gasOptimizationModule,
  reentrancyModule,
  integerOverflowModule,
  accessControlModule,
  oracleManipulationModule,
  flashLoanModule
];