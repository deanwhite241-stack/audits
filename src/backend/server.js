// Backend server implementation for reference
// This would be deployed separately as a Node.js application

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { ethers } = require('ethers');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Etherscan API configuration
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
      }
    });
    
    return response.data.result[0];
  } catch (error) {
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
      }
    });
    
    return response.data.result;
  } catch (error) {
    throw new Error('Failed to fetch contract bytecode');
  }
};

const analyzeWithAI = async (code, isSourceCode = true) => {
  const prompt = `
    Analyze this Solidity smart contract for security vulnerabilities, backdoors, honeypots, and hidden malicious logic.
    
    Code type: ${isSourceCode ? 'Source Code' : 'Bytecode'}
    
    Contract:
    ${code}
    
    Please provide a comprehensive security analysis with the following structure:
    
    1. Risk Score (0-100): Overall security risk
    2. Critical Vulnerabilities: List any critical security issues
    3. Medium Vulnerabilities: List medium severity issues
    4. Low/Informational Issues: List minor issues and optimizations
    5. Spyware/Privacy Risks: Any data collection or privacy concerns
    6. Honeypot Indicators: Signs this might be a honeypot
    7. Backdoor Risks: Hidden administrative functions or backdoors
    8. Contract Information: Details about ownership, upgradeability, etc.
    9. Recommendations: Security improvement suggestions
    
    Format the response as JSON with clear categorization.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert smart contract security auditor. Provide detailed, accurate security analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error('AI analysis failed');
  }
};

// Routes
app.post('/api/audit', async (req, res) => {
  try {
    const { contractAddress } = req.body;
    
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    // Fetch contract source code
    const sourceData = await fetchContractSource(contractAddress);
    
    let analysisInput = '';
    let isVerified = false;
    
    if (sourceData.SourceCode && sourceData.SourceCode !== '') {
      analysisInput = sourceData.SourceCode;
      isVerified = true;
    } else {
      // Fetch bytecode if source is not available
      const bytecode = await fetchContractBytecode(contractAddress);
      analysisInput = bytecode;
    }

    // Analyze with AI
    const aiAnalysis = await analyzeWithAI(analysisInput, isVerified);
    
    // Parse AI response and structure the result
    const result = {
      contractAddress,
      timestamp: new Date().toISOString(),
      isVerified,
      aiAnalysis: JSON.parse(aiAnalysis),
      // Add more structured data here
    };

    res.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ error: 'Audit failed' });
  }
});

app.get('/api/audit/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { paid } = req.query;
    
    // Fetch audit from database
    // Return appropriate data based on payment status
    
    res.json({ message: 'Audit retrieved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;