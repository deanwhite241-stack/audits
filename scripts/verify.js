const { run } = require("hardhat");

async function main() {
  const contractAddress = process.argv[2];
  const usdtAddress = process.argv[3];

  if (!contractAddress || !usdtAddress) {
    console.error("Usage: npx hardhat run scripts/verify.js --network <network> <contractAddress> <usdtAddress>");
    process.exit(1);
  }

  console.log("🔍 Verifying contract on Etherscan...");
  console.log("📍 Contract:", contractAddress);
  console.log("💵 USDT Address:", usdtAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [usdtAddress],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });