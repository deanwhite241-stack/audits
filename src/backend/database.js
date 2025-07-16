const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.init();
  }

  async init() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'contractguard',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      });

      // Test connection
      const connection = await this.pool.getConnection();
      console.log('✅ Database connected successfully');
      connection.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Users
  async createUser(walletAddress) {
    const sql = 'INSERT IGNORE INTO users (wallet_address) VALUES (?)';
    return await this.query(sql, [walletAddress]);
  }

  async getUser(walletAddress) {
    const sql = 'SELECT * FROM users WHERE wallet_address = ?';
    const results = await this.query(sql, [walletAddress]);
    return results[0];
  }

  // Projects
  async createProject(projectData) {
    const sql = `
      INSERT INTO projects (name, description, logo_url, contract_address, chain, type, website, twitter, telegram, audit_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      projectData.name,
      projectData.description,
      projectData.logo_url || '',
      projectData.contract_address,
      projectData.chain,
      projectData.type,
      projectData.website || '',
      projectData.twitter || '',
      projectData.telegram || '',
      `/audit/${projectData.contract_address}`
    ];
    return await this.query(sql, params);
  }

  async getProjects(filters = {}) {
    let sql = 'SELECT * FROM projects WHERE status = "approved"';
    const params = [];

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR contract_address LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.chain) {
      sql += ' AND chain = ?';
      params.push(filters.chain);
    }

    if (filters.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.certificateOnly) {
      sql += ' AND certificate = "Gold ESR"';
    }

    sql += ' ORDER BY approved_at DESC';
    return await this.query(sql, params);
  }

  async getPendingProjects() {
    const sql = 'SELECT * FROM projects WHERE status = "pending" ORDER BY submitted_at DESC';
    return await this.query(sql);
  }

  async approveProject(projectId, certificate, approvedBy) {
    const sql = `
      UPDATE projects 
      SET status = "approved", certificate = ?, approved_at = NOW(), approved_by = ?
      WHERE id = ?
    `;
    return await this.query(sql, [certificate, approvedBy, projectId]);
  }

  async rejectProject(projectId, reason) {
    const sql = `
      UPDATE projects 
      SET status = "rejected", rejection_reason = ?, rejected_at = NOW()
      WHERE id = ?
    `;
    return await this.query(sql, [reason, projectId]);
  }

  // Audits
  async createAudit(auditData) {
    const sql = `
      INSERT INTO audits (contract_address, user_address, risk_score, summary, contract_info, issue_count, free_report, premium_report, is_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      auditData.contract_address,
      auditData.user_address || null,
      auditData.risk_score,
      auditData.summary,
      JSON.stringify(auditData.contract_info),
      JSON.stringify(auditData.issue_count),
      JSON.stringify(auditData.free_report),
      JSON.stringify(auditData.premium_report),
      auditData.is_paid || false
    ];
    return await this.query(sql, params);
  }

  async getAudit(contractAddress, userAddress = null) {
    let sql = 'SELECT * FROM audits WHERE contract_address = ?';
    const params = [contractAddress];

    if (userAddress) {
      sql += ' AND user_address = ?';
      params.push(userAddress);
    }

    sql += ' ORDER BY created_at DESC LIMIT 1';
    const results = await this.query(sql, params);
    
    if (results.length > 0) {
      const audit = results[0];
      // Parse JSON fields
      audit.contract_info = JSON.parse(audit.contract_info);
      audit.issue_count = JSON.parse(audit.issue_count);
      audit.free_report = JSON.parse(audit.free_report);
      audit.premium_report = JSON.parse(audit.premium_report);
      return audit;
    }
    return null;
  }

  async getUserAudits(userAddress) {
    const sql = `
      SELECT contract_address, risk_score, is_paid, created_at as timestamp
      FROM audits 
      WHERE user_address = ? 
      ORDER BY created_at DESC
    `;
    return await this.query(sql, [userAddress]);
  }

  async getAuditHistory(userAddress) {
    const sql = `
      SELECT 
        contract_address,
        risk_score,
        summary,
        contract_info,
        issue_count,
        free_report,
        premium_report,
        is_paid,
        created_at as timestamp
      FROM audits 
      WHERE user_address = ? 
      ORDER BY created_at DESC
    `;
    const results = await this.query(sql, [userAddress]);
    
    return results.map(audit => ({
      ...audit,
      contract_info: JSON.parse(audit.contract_info),
      issue_count: JSON.parse(audit.issue_count),
      free_report: JSON.parse(audit.free_report),
      premium_report: JSON.parse(audit.premium_report)
    }));
  }

  async updateAuditPayment(contractAddress, userAddress, txHash) {
    const sql = `
      UPDATE audits 
      SET is_paid = TRUE, payment_tx_hash = ?, updated_at = NOW()
      WHERE contract_address = ? AND user_address = ?
    `;
    return await this.query(sql, [txHash, contractAddress, userAddress]);
  }

  // Payments
  async createPayment(paymentData) {
    const sql = `
      INSERT INTO payments (user_address, contract_address, amount, currency, tx_hash, block_number, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      paymentData.user_address,
      paymentData.contract_address,
      paymentData.amount,
      paymentData.currency,
      paymentData.tx_hash,
      paymentData.block_number || null,
      paymentData.status || 'pending'
    ];
    return await this.query(sql, params);
  }

  async getPayment(txHash) {
    const sql = 'SELECT * FROM payments WHERE tx_hash = ?';
    const results = await this.query(sql, [txHash]);
    return results[0];
  }

  async confirmPayment(txHash, blockNumber) {
    const sql = `
      UPDATE payments 
      SET status = "confirmed", block_number = ?, confirmed_at = NOW()
      WHERE tx_hash = ?
    `;
    return await this.query(sql, [blockNumber, txHash]);
  }

  async hasUserPaid(userAddress, contractAddress) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM payments 
      WHERE user_address = ? AND contract_address = ? AND status = "confirmed"
    `;
    const results = await this.query(sql, [userAddress, contractAddress]);
    return results[0].count > 0;
  }

  // Admin
  async isAdmin(walletAddress) {
    const sql = 'SELECT * FROM admin_users WHERE wallet_address = ?';
    const results = await this.query(sql, [walletAddress]);
    return results.length > 0;
  }

  // Statistics
  async getStats() {
    const sql = 'SELECT * FROM project_stats';
    const results = await this.query(sql);
    return results[0];
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = new Database();