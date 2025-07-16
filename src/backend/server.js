const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Etherscan configuration
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';

// Utility functions
const fetchContractSource = async (address) => {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: ETHERSCAN_API_KEY
      },
      timeout: 10000
    });
    
    if (response.data.status !== '1') {
      throw new Error('Failed to fetch contract source from Etherscan');
    }
    
    return response.data.result[0];
  } catch (error) {
    console.error('Etherscan API error:', error.message);
    throw new Error('Failed to fetch contract source');
  }
};

const fetchContractBytecode = async (address) => {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: 'proxy',
        action: 'eth_getCode',
        address: address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY
      },
      timeout: 10000
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Bytecode fetch error:', error.message);
    throw new Error('Failed to fetch contract bytecode');
  }
};

const analyzeWithAI = async (code, contractAddress, isSourceCode = true) => {
  const prompt = `
    You are an expert smart contract security auditor. Analyze this ${isSourceCode ? 'Solidity source code' : 'bytecode'} for security vulnerabilities, backdoors, honeypots, and malicious logic.
    
    Contract Address: ${contractAddress}
    Code Type: ${isSourceCode ? 'Source Code' : 'Bytecode'}
    
    Contract Code:
    ${code}
    
    Provide a comprehensive security analysis in the following JSON format:
    {
      "riskScore": 0-100,
      "summary": "Brief overall assessment",
      "contractInfo": {
        "isVerified": ${isSourceCode},
        "hasOwnable": boolean,
        "hasMintable": boolean,
        "hasUpgradeable": boolean,
        "compiler": "version or unknown"
      },
      "issueCount": {
        "critical": number,
        "medium": number,
        "low": number,
        "informational": number
      },
      "freeReport": {
        "summary": "Basic security summary",
        "basicVulnerabilities": ["list of basic issues"],
        "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL"
      },
      "premiumReport": {
        "criticalVulnerabilities": ["detailed critical issues"],
        "mediumVulnerabilities": ["medium severity issues"],
        "spywareRisks": ["privacy and data collection risks"],
        "honeypotRisks": ["trading restriction indicators"],
        "backdoorRisks": ["hidden administrative functions"],
        "recommendations": ["security improvement suggestions"],
        "detailedAnalysis": "comprehensive technical analysis"
      }
    }
    
    Focus on:
    1. Reentrancy vulnerabilities
    2. Access control issues
    3. Integer overflow/underflow
    4. Unchecked external calls
    5. Hidden malicious functions
    6. Honeypot mechanisms
    7. Backdoor access patterns
    8. Privacy violations
    9. Upgrade mechanisms
    10. Owner privileges
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert smart contract security auditor with deep knowledge of Solidity, DeFi protocols, and blockchain security. Provide accurate, detailed security analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.1
    });

    const analysisText = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback response if JSON parsing fails
      return {
        riskScore: 50,
        summary: "Analysis completed but response format error occurred",
        contractInfo: {
          isVerified: isSourceCode,
          hasOwnable: false,
          hasMintable: false,
          hasUpgradeable: false,
          compiler: "unknown"
        },
        issueCount: {
          critical: 0,
          medium: 1,
          low: 1,
          informational: 1
        },
        freeReport: {
          summary: "Basic analysis completed. Please try again for detailed results.",
          basicVulnerabilities: ["Analysis format error - please retry"],
          riskLevel: "MEDIUM"
        },
        premiumReport: {
          criticalVulnerabilities: [],
          mediumVulnerabilities: ["Response parsing error occurred"],
          spywareRisks: [],
          honeypotRisks: [],
          backdoorRisks: [],
          recommendations: ["Retry analysis for complete results"],
          detailedAnalysis: "Analysis completed but formatting error occurred. Please try again."
        }
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('AI analysis failed: ' + error.message);
  }
};

// Validation middleware
const validateContractAddress = (req, res, next) => {
  const { contractAddress } = req.body;
  
  if (!contractAddress) {
    return res.status(400).json({ error: 'Contract address is required' });
  }
  
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(contractAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum contract address format' });
  }
  
  next();
};

// Routes
app.post('/api/audit', validateContractAddress, async (req, res) => {
  try {
    const { contractAddress } = req.body;
    
    console.log(`Starting audit for contract: ${contractAddress}`);
    
    // Fetch contract source code
    let sourceData;
    try {
      sourceData = await fetchContractSource(contractAddress);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to fetch contract data from Etherscan' });
    }
    
    let analysisInput = '';
    let isVerified = false;
    
    if (sourceData.SourceCode && sourceData.SourceCode !== '') {
      analysisInput = sourceData.SourceCode;
      isVerified = true;
      console.log('Using verified source code for analysis');
    } else {
      // Fetch bytecode if source is not available
      try {
        const bytecode = await fetchContractBytecode(contractAddress);
        analysisInput = bytecode;
        console.log('Using bytecode for analysis');
      } catch (error) {
        return res.status(400).json({ error: 'Contract not found or invalid address' });
      }
    }

    if (!analysisInput || analysisInput === '0x') {
      return res.status(400).json({ error: 'No contract code found at this address' });
    }

    // Analyze with AI
    console.log('Starting AI analysis...');
    const aiAnalysis = await analyzeWithAI(analysisInput, contractAddress, isVerified);
    
    // Structure the result
    const result = {
      contractAddress,
      timestamp: new Date().toISOString(),
      riskScore: aiAnalysis.riskScore,
      summary: aiAnalysis.summary,
      issueCount: aiAnalysis.issueCount,
      contractInfo: {
        ...aiAnalysis.contractInfo,
        isVerified,
        compiler: sourceData.CompilerVersion || aiAnalysis.contractInfo.compiler
      },
      freeReport: aiAnalysis.freeReport,
      premiumReport: aiAnalysis.premiumReport,
      isPaid: false // This would be determined by payment verification
    };

    console.log(`Analysis completed for ${contractAddress}`);
    res.json(result);
    
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ 
      error: 'Audit analysis failed', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY,
    etherscan: !!process.env.ETHERSCAN_API_KEY
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ContractGuard API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔍 Etherscan API: ${process.env.ETHERSCAN_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;
