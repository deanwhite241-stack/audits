// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title AuditPay
 * @dev Smart contract for handling payments for ContractGuard audit services
 * @author ContractGuard Team
 */
contract AuditPay is Ownable, ReentrancyGuard, Pausable {
    // Payment fees (can be updated by owner)
    uint256 public ethFee = 0.01 ether;  // $500 equivalent in ETH
    uint256 public usdtFee = 500 * 10**6; // $500 USDT (6 decimals)
    
    // USDT contract address (will be set in constructor)
    IERC20 public immutable USDT;
    
    // Mapping to track paid audits: user => contractAddress => hasPaid
    mapping(address => mapping(string => bool)) public paidAudits;
    
    // User audit counts for analytics
    mapping(address => uint256) public userAuditCount;
    
    // Total statistics
    uint256 public totalAudits;
    uint256 public totalEthCollected;
    uint256 public totalUsdtCollected;
    
    // Events
    event AuditPaid(
        address indexed user, 
        string contractAddress, 
        uint256 amount, 
        bool isEth,
        uint256 timestamp
    );
    
    event FeeUpdated(uint256 newEthFee, uint256 newUsdtFee);
    event EmergencyWithdraw(address token, uint256 amount);
    
    // Custom errors for gas efficiency
    error InsufficientPayment();
    error AlreadyPaid();
    error InsufficientBalance();
    error TransferFailed();
    error InvalidAddress();
    error InvalidAmount();
    
    /**
     * @dev Constructor sets the USDT token address
     * @param _usdtAddress Address of the USDT token contract
     */
    constructor(address _usdtAddress) {
        if (_usdtAddress == address(0)) revert InvalidAddress();
        USDT = IERC20(_usdtAddress);
    }
    
    /**
     * @dev Pay for audit using ETH
     * @param contractAddress The contract address being audited
     */
    function payForAuditETH(string memory contractAddress) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        if (msg.value < ethFee) revert InsufficientPayment();
        if (paidAudits[msg.sender][contractAddress]) revert AlreadyPaid();
        
        // Mark as paid
        paidAudits[msg.sender][contractAddress] = true;
        userAuditCount[msg.sender]++;
        totalAudits++;
        totalEthCollected += msg.value;
        
        emit AuditPaid(msg.sender, contractAddress, msg.value, true, block.timestamp);
        
        // Refund excess payment
        if (msg.value > ethFee) {
            uint256 refund = msg.value - ethFee;
            (bool success, ) = payable(msg.sender).call{value: refund}("");
            if (!success) revert TransferFailed();
        }
    }
    
    /**
     * @dev Pay for audit using USDT
     * @param contractAddress The contract address being audited
     */
    function payForAuditUSDT(string memory contractAddress) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        if (paidAudits[msg.sender][contractAddress]) revert AlreadyPaid();
        if (USDT.balanceOf(msg.sender) < usdtFee) revert InsufficientBalance();
        
        // Transfer USDT from user to contract
        bool success = USDT.transferFrom(msg.sender, address(this), usdtFee);
        if (!success) revert TransferFailed();
        
        // Mark as paid
        paidAudits[msg.sender][contractAddress] = true;
        userAuditCount[msg.sender]++;
        totalAudits++;
        totalUsdtCollected += usdtFee;
        
        emit AuditPaid(msg.sender, contractAddress, usdtFee, false, block.timestamp);
    }
    
    /**
     * @dev Check if user has paid for a specific audit
     * @param user User address
     * @param contractAddress Contract address being audited
     * @return bool Whether the user has paid
     */
    function hasPaidForAudit(address user, string memory contractAddress) 
        external 
        view 
        returns (bool) 
    {
        return paidAudits[user][contractAddress];
    }
    
    /**
     * @dev Update payment fees (only owner)
     * @param _ethFee New ETH fee
     * @param _usdtFee New USDT fee
     */
    function updateFees(uint256 _ethFee, uint256 _usdtFee) external onlyOwner {
        if (_ethFee == 0 || _usdtFee == 0) revert InvalidAmount();
        
        ethFee = _ethFee;
        usdtFee = _usdtFee;
        
        emit FeeUpdated(_ethFee, _usdtFee);
    }
    
    /**
     * @dev Withdraw collected ETH (only owner)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert InsufficientBalance();
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert TransferFailed();
        
        emit EmergencyWithdraw(address(0), balance);
    }
    
    /**
     * @dev Withdraw collected USDT (only owner)
     */
    function withdrawUSDT() external onlyOwner {
        uint256 balance = USDT.balanceOf(address(this));
        if (balance == 0) revert InsufficientBalance();
        
        bool success = USDT.transfer(owner(), balance);
        if (!success) revert TransferFailed();
        
        emit EmergencyWithdraw(address(USDT), balance);
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 _totalAudits,
        uint256 _totalEthCollected,
        uint256 _totalUsdtCollected,
        uint256 _currentEthFee,
        uint256 _currentUsdtFee
    ) {
        return (
            totalAudits,
            totalEthCollected,
            totalUsdtCollected,
            ethFee,
            usdtFee
        );
    }
    
    /**
     * @dev Get user statistics
     * @param user User address
     */
    function getUserStats(address user) external view returns (uint256 auditCount) {
        return userAuditCount[user];
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Allow contract to receive ETH
    }
}