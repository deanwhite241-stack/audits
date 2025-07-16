// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AuditPay is Ownable, ReentrancyGuard {
    uint256 public ethFee = 0.01 ether;
    uint256 public usdtFee = 15 * 10**6; // 15 USDT (6 decimals)
    
    IERC20 public immutable USDT;
    
    mapping(address => mapping(string => bool)) public paidAudits;
    mapping(address => uint256) public userAuditCount;
    
    event AuditPaid(address indexed user, string contractAddress, uint256 amount, bool isEth);
    event FeeUpdated(uint256 newEthFee, uint256 newUsdtFee);
    
    constructor(address _usdtAddress) {
        USDT = IERC20(_usdtAddress);
    }
    
    function payForAuditETH(string memory contractAddress) external payable nonReentrant {
        require(msg.value >= ethFee, "Insufficient ETH payment");
        require(!paidAudits[msg.sender][contractAddress], "Already paid for this audit");
        
        paidAudits[msg.sender][contractAddress] = true;
        userAuditCount[msg.sender]++;
        
        emit AuditPaid(msg.sender, contractAddress, msg.value, true);
    }
    
    function payForAuditUSDT(string memory contractAddress) external nonReentrant {
        require(!paidAudits[msg.sender][contractAddress], "Already paid for this audit");
        require(USDT.balanceOf(msg.sender) >= usdtFee, "Insufficient USDT balance");
        
        require(USDT.transferFrom(msg.sender, address(this), usdtFee), "USDT transfer failed");
        
        paidAudits[msg.sender][contractAddress] = true;
        userAuditCount[msg.sender]++;
        
        emit AuditPaid(msg.sender, contractAddress, usdtFee, false);
    }
    
    function hasPaidForAudit(address user, string memory contractAddress) external view returns (bool) {
        return paidAudits[user][contractAddress];
    }
    
    function updateFees(uint256 _ethFee, uint256 _usdtFee) external onlyOwner {
        ethFee = _ethFee;
        usdtFee = _usdtFee;
        emit FeeUpdated(_ethFee, _usdtFee);
    }
    
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
    
    function withdrawUSDT() external onlyOwner {
        uint256 balance = USDT.balanceOf(address(this));
        require(balance > 0, "No USDT to withdraw");
        USDT.transfer(owner(), balance);
    }
}