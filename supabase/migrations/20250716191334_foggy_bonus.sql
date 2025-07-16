-- ContractGuard Database Schema
-- Run this in phpMyAdmin or MySQL client

CREATE DATABASE IF NOT EXISTS contractguard;
USE contractguard;

-- Users table for wallet addresses and user data
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wallet_address (wallet_address)
);

-- Projects table for submitted projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logo_url VARCHAR(500),
    contract_address VARCHAR(42) NOT NULL,
    chain VARCHAR(50) NOT NULL,
    type ENUM('Token', 'NFT', 'DeFi', 'Staking', 'Launchpad', 'DAO', 'Other') NOT NULL,
    website VARCHAR(500),
    twitter VARCHAR(500),
    telegram VARCHAR(500),
    audit_url VARCHAR(500),
    certificate ENUM('None', 'Verified', 'Gold ESR') DEFAULT 'None',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(42),
    rejection_reason TEXT,
    rejected_at TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_contract_address (contract_address),
    INDEX idx_chain (chain),
    INDEX idx_type (type),
    INDEX idx_certificate (certificate)
);

-- Audits table for contract analysis results
CREATE TABLE audits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_address VARCHAR(42) NOT NULL,
    user_address VARCHAR(42),
    risk_score INT NOT NULL,
    summary TEXT,
    contract_info JSON,
    issue_count JSON,
    free_report JSON,
    premium_report JSON,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contract_address (contract_address),
    INDEX idx_user_address (user_address),
    INDEX idx_created_at (created_at),
    INDEX idx_is_paid (is_paid)
);

-- Payments table for tracking premium audit payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency ENUM('ETH', 'USDT') NOT NULL,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT,
    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    INDEX idx_user_address (user_address),
    INDEX idx_contract_address (contract_address),
    INDEX idx_tx_hash (tx_hash),
    INDEX idx_status (status)
);

-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallet_address (wallet_address)
);

-- Insert default admin (replace with your wallet address)
INSERT INTO admin_users (wallet_address, role) VALUES 
('0x0000000000000000000000000000000000000000', 'admin');

-- API keys table for storing encrypted API keys
CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(50) UNIQUE NOT NULL,
    api_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Session storage for user sessions
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(128) UNIQUE NOT NULL,
    user_address VARCHAR(42) NOT NULL,
    data JSON,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_user_address (user_address),
    INDEX idx_expires_at (expires_at)
);

-- Audit history view for easy querying
CREATE VIEW audit_history AS
SELECT 
    a.id,
    a.contract_address,
    a.user_address,
    a.risk_score,
    a.summary,
    a.is_paid,
    a.created_at,
    u.wallet_address as user_wallet
FROM audits a
LEFT JOIN users u ON a.user_address = u.wallet_address
ORDER BY a.created_at DESC;

-- Project statistics view
CREATE VIEW project_stats AS
SELECT 
    COUNT(*) as total_projects,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_projects,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_projects,
    SUM(CASE WHEN certificate = 'Gold ESR' THEN 1 ELSE 0 END) as gold_esr_projects,
    SUM(CASE WHEN certificate = 'Verified' THEN 1 ELSE 0 END) as verified_projects
FROM projects;