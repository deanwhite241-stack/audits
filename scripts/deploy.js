const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting ContractGuard AuditPay deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH\n");

  // USDT contract addresses for different networks
  const USDT_ADDRESSES = {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",     // Ethereum Mainnet
    11155111: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", // Sepolia Testnet
    137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",    // Polygon Mainnet
    56: "0x55d398326f99059fF775485246999027B3197955"      // BSC Mainnet
  };

  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", chainId);

  // Get USDT address for current network
  const usdtAddress = USDT_ADDRESSES[chainId];
  if (!usdtAddress) {
    console.error("❌ USDT address not configured for chain ID:", chainId);
    console.log("Available networks:", Object.keys(USDT_ADDRESSES));
    process.exit(1);
  }

  console.log("💵 USDT Address:", usdtAddress, "\n");

  // Deploy the contract
  console.log("📦 Deploying AuditPay contract...");
  const AuditPay = await ethers.getContractFactory("AuditPay");
  
  // Estimate gas
  const deploymentData = AuditPay.interface.encodeDeploy([usdtAddress]);
  const estimatedGas = await ethers.provider.estimateGas({
    data: deploymentData
  });
  console.log("⛽ Estimated gas:", estimatedGas.toString());

  // Deploy with gas limit
  const auditPay = await AuditPay.deploy(usdtAddress, {
    gasLimit: estimatedGas.mul(120).div(100) // Add 20% buffer
  });

  console.log("⏳ Waiting for deployment transaction...");
  await auditPay.deployed();

  console.log("\n✅ AuditPay deployed successfully!");
  console.log("📍 Contract address:", auditPay.address);
  console.log("🔗 Transaction hash:", auditPay.deployTransaction.hash);
  console.log("⛽ Gas used:", auditPay.deployTransaction.gasLimit?.toString());

  // Verify initial state
  console.log("\n🔍 Verifying contract state...");
  const ethFee = await auditPay.ethFee();
  const usdtFee = await auditPay.usdtFee();
  const owner = await auditPay.owner();

  console.log("💰 ETH Fee:", ethers.utils.formatEther(ethFee), "ETH");
  console.log("💵 USDT Fee:", ethers.utils.formatUnits(usdtFee, 6), "USDT");
  console.log("👤 Owner:", owner);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: chainId,
    contractAddress: auditPay.address,
    transactionHash: auditPay.deployTransaction.hash,
    deployer: deployer.address,
    usdtAddress: usdtAddress,
    ethFee: ethers.utils.formatEther(ethFee),
    usdtFee: ethers.utils.formatUnits(usdtFee, 6),
    deployedAt: new Date().toISOString()
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Update frontend contract address in src/services/web3.ts");
  console.log("2. Verify contract on Etherscan (if on mainnet):");
  console.log(`   npx hardhat verify --network ${network.name} ${auditPay.address} ${usdtAddress}`);
  console.log("3. Test the contract with small amounts first");
  console.log("4. Update documentation with new contract address");

  return deploymentInfo;
}

// Handle errors
main()
  .then((deploymentInfo) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });