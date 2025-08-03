import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the remaining contracts that failed verification on Avalanche Fuji
 * RealEstateNFT, LendingPool, LoanManager
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployRemainingContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🚀 Deploying remaining contracts on Avalanche Fuji...");
  console.log("Deployer:", deployer);

  // Get already deployed contracts addresses (checksummed)
  const mockUSDT = "0x7e4c6f4e725bb1c56d7d2c92cbef5a6c2b3d1b80";
  const mockTeleporter = "0xe73f5d71c375b959ed562fee4b6577be61e8465d";

  // 1. Deploy RealEstateNFT
  console.log("\n📋 Deploying RealEstateNFT...");
  const realEstateNFT = await deploy("RealEstateNFT", {
    from: deployer,
    args: [deployer], // initialOwner
    log: true,
    autoMine: true,
  });

  // 2. Deploy LendingPool
  console.log("\n🏦 Deploying LendingPool...");
  const lendingPool = await deploy("LendingPool", {
    from: deployer,
    args: [deployer, mockUSDT, mockTeleporter], // initialOwner, _usdt, _teleporter
    log: true,
    autoMine: true,
  });

  // 3. Deploy LoanManager
  console.log("\n💰 Deploying LoanManager...");
  const loanManager = await deploy("LoanManager", {
    from: deployer,
    args: [
      deployer,                  // initialOwner
      realEstateNFT.address,     // _realEstateNFT
      lendingPool.address,       // _lendingPool  
      mockUSDT,                  // _usdtToken
      mockTeleporter,            // _teleporterMessenger
      "0x0000000000000000000000000000000000000000000000000000000000000000" // _destinationBlockchainID (placeholder)
    ],
    log: true,
    autoMine: true,
  });

  console.log("\n✅ ALL CONTRACTS DEPLOYED:");
  console.log("=".repeat(50));
  console.log("RealEstateNFT:     ", realEstateNFT.address);
  console.log("LendingPool:       ", lendingPool.address);
  console.log("LoanManager:       ", loanManager.address);
  console.log("=".repeat(50));

  console.log("\n📝 VERIFICATION COMMANDS:");
  console.log("npx hardhat verify --network avalancheFuji", realEstateNFT.address, deployer);
  console.log("npx hardhat verify --network avalancheFuji", lendingPool.address, mockUSDT, mockTeleporter);
  console.log("npx hardhat verify --network avalancheFuji", loanManager.address, lendingPool.address);

  console.log("\n🔗 SNOWTRACE LINKS:");
  console.log("RealEstateNFT:     https://testnet.snowtrace.io/address/" + realEstateNFT.address);
  console.log("LendingPool:       https://testnet.snowtrace.io/address/" + lendingPool.address);
  console.log("LoanManager:       https://testnet.snowtrace.io/address/" + loanManager.address);
};

export default deployRemainingContracts;

deployRemainingContracts.tags = ["RemainingContracts"];
