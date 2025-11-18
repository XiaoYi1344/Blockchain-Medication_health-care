// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying contract with account:", deployer.address);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "PZO");

  // Gắn signer khi tạo contract
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry", deployer);

  // Truyền marketplace address (ví bạn hoặc marketplace thật)
  const marketplaceAddr = "0xcc2905b03582f15589fdb7ed0311c29412f64baa";
  const contract = await ProductRegistry.deploy(marketplaceAddr);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ ProductRegistry deployed to:", contractAddress);

  // Lưu ra file JSON
  const contractInfo = {
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync("./info-address.json", JSON.stringify(contractInfo, null, 2));
  console.log("💾 Contract address saved to info-address.json");
}

main().catch((error) => {
  console.error("❌ Deploy failed:", error);
  process.exitCode = 1;
});
