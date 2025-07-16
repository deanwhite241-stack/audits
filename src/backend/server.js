const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'https://papaya-seahorse-ebcc5a.netlify.app'],
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

// In-memory storage (replace with database in production)
let projects = [];
let userAudits = {};
let auditHistory = {};

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

    // Store audit in history
    if (!auditHistory[contractAddress]) {
      auditHistory[contractAddress] = [];
    }
    auditHistory[contractAddress].push(result);

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
app.get('/api/user/:address/audits', (req, res) => {
  const { address } = req.params;
  const audits = userAudits[address] || [];
  res.json(audits);
});

app.get('/api/user/:address/history', (req, res) => {
  const { address } = req.params;
  const history = [];
  
  // Collect all audits for this user
  Object.values(auditHistory).flat().forEach(audit => {
    history.push(audit);
  });
  
  res.json(history);
});

// Projects management
app.get('/api/projects', (req, res) => {
  const { search, chain, type, certificateOnly } = req.query;
  let filteredProjects = projects.filter(p => p.status === 'approved');
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.contractAddress.toLowerCase().includes(searchLower)
    );
  }
  
  if (chain) {
    filteredProjects = filteredProjects.filter(p => p.chain === chain);
  }
  
  if (type) {
    filteredProjects = filteredProjects.filter(p => p.type === type);
  }
  
  if (certificateOnly === 'true') {
    filteredProjects = filteredProjects.filter(p => p.certificate === 'Gold ESR');
  }
  
  res.json(filteredProjects);
});

app.post('/api/projects/submit', upload.single('logo'), (req, res) => {
  try {
    const { name, description, contractAddress, chain, type, website, twitter, telegram } = req.body;
    
    if (!name || !description || !contractAddress || !chain || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const project = {
      id: Date.now().toString(),
      name,
      description,
      logo: req.file ? `/uploads/${req.file.filename}` : '',
      contractAddress,
      chain,
      type,
      website: website || '',
      twitter: twitter || '',
      telegram: telegram || '',
      auditUrl: `/audit/${contractAddress}`,
      certificate: 'None',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    projects.push(project);
    
    res.json({ success: true, message: 'Project submitted successfully for review' });
  } catch (error) {
    console.error('Project submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// Admin routes
app.get('/api/admin/projects/pending', (req, res) => {
  const pendingProjects = projects.filter(p => p.status === 'pending');
  res.json(pendingProjects);
});

app.post('/api/admin/projects/:id/approve', (req, res) => {
  const { id } = req.params;
  const { certificate } = req.body;
  
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  project.status = 'approved';
  project.certificate = certificate;
  project.approvedAt = new Date().toISOString();
  project.approvedBy = 'admin';
  
  res.json({ success: true });
});

app.post('/api/admin/projects/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  project.status = 'rejected';
  project.rejectionReason = reason;
  project.rejectedAt = new Date().toISOString();
  
  res.json({ success: true });
});

// Payment verification
app.post('/api/payment/verify', (req, res) => {
  const { userAddress, contractAddress } = req.body;
  
  // This would integrate with your smart contract to verify payment
  // For now, returning false - implement with actual Web3 integration
  res.json({ hasPaid: false });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY,
    etherscan: !!process.env.ETHERSCAN_API_KEY,
    projects: projects.length,
    audits: Object.keys(auditHistory).length
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
