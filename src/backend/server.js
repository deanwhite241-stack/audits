const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173', 
    'https://papaya-seahorse-ebcc5a.netlify.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

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
    
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('AI analysis returned invalid format');
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
    const userAddress = req.headers['x-user-address']; // Optional user address from frontend
    
    console.log(`Starting audit for contract: ${contractAddress}`);
    
    // Check if audit already exists
    const existingAudit = await db.getAudit(contractAddress, userAddress);
    if (existingAudit) {
      console.log('Returning cached audit result');
      return res.json({
        contractAddress: existingAudit.contract_address,
        timestamp: existingAudit.created_at,
        riskScore: existingAudit.risk_score,
        summary: existingAudit.summary,
        issueCount: existingAudit.issue_count,
        contractInfo: existingAudit.contract_info,
        freeReport: existingAudit.free_report,
        premiumReport: existingAudit.premium_report,
        isPaid: existingAudit.is_paid
      });
    }
    
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
      isPaid: false
    };

    // Save audit to database
    await db.createAudit({
      contract_address: contractAddress,
      user_address: userAddress,
      risk_score: aiAnalysis.riskScore,
      summary: aiAnalysis.summary,
      contract_info: result.contractInfo,
      issue_count: aiAnalysis.issueCount,
      free_report: aiAnalysis.freeReport,
      premium_report: aiAnalysis.premiumReport,
      is_paid: false
    });

    // Create user if provided
    if (userAddress) {
      await db.createUser(userAddress);
    }

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

// User audit history
app.get('/api/user/:address/audits', async (req, res) => {
  try {
    const { address } = req.params;
    const audits = await db.getUserAudits(address);
    
    const formattedAudits = audits.map(audit => ({
      id: `${audit.contract_address}-${audit.timestamp}`,
      contractAddress: audit.contract_address,
      timestamp: audit.timestamp,
      status: audit.is_paid ? 'paid' : 'free',
      riskScore: audit.risk_score
    }));
    
    res.json(formattedAudits);
  } catch (error) {
    console.error('Failed to fetch user audits:', error);
    res.status(500).json({ error: 'Failed to fetch user audits' });
  }
});

app.get('/api/user/:address/history', async (req, res) => {
  try {
    const { address } = req.params;
    const history = await db.getAuditHistory(address);
    res.json(history);
  } catch (error) {
    console.error('Failed to fetch audit history:', error);
    res.status(500).json({ error: 'Failed to fetch audit history' });
  }
});

// Projects management
app.get('/api/projects', async (req, res) => {
  try {
    const { search, chain, type, certificateOnly } = req.query;
    const filters = {
      search,
      chain,
      type,
      certificateOnly: certificateOnly === 'true'
    };
    
    const projects = await db.getProjects(filters);
    res.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects/submit', upload.single('logo'), async (req, res) => {
  try {
    const { name, description, contractAddress, chain, type, website, twitter, telegram } = req.body;
    
    if (!name || !description || !contractAddress || !chain || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const projectData = {
      name,
      description,
      logo_url: req.file ? `/uploads/${req.file.filename}` : '',
      contract_address: contractAddress,
      chain,
      type,
      website: website || '',
      twitter: twitter || '',
      telegram: telegram || ''
    };
    
    await db.createProject(projectData);
    
    res.json({ success: true, message: 'Project submitted successfully for review' });
  } catch (error) {
    console.error('Project submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// Admin routes
app.get('/api/admin/projects/pending', async (req, res) => {
  try {
    const pendingProjects = await db.getPendingProjects();
    res.json(pendingProjects);
  } catch (error) {
    console.error('Failed to fetch pending projects:', error);
    res.status(500).json({ error: 'Failed to fetch pending projects' });
  }
});

app.post('/api/admin/projects/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { certificate } = req.body;
    const approvedBy = req.headers['x-user-address'] || 'admin';
    
    await db.approveProject(id, certificate, approvedBy);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to approve project:', error);
    res.status(500).json({ error: 'Failed to approve project' });
  }
});

app.post('/api/admin/projects/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await db.rejectProject(id, reason);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to reject project:', error);
    res.status(500).json({ error: 'Failed to reject project' });
  }
});

// Payment verification
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { userAddress, contractAddress } = req.body;
    const hasPaid = await db.hasUserPaid(userAddress, contractAddress);
    res.json({ hasPaid });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      openai: !!process.env.OPENAI_API_KEY,
      etherscan: !!process.env.ETHERSCAN_API_KEY,
      database: 'connected',
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message
    });
  }
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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 ContractGuard API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔍 Etherscan API: ${process.env.ETHERSCAN_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🗄️  Database: ${process.env.DB_HOST ? '✅ Configured' : '❌ Using localhost'}`);
});

module.exports = app;