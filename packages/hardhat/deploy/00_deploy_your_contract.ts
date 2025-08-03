import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  console.log("🚀 Deploying Real Estate Lending Platform with ICM integration...");
  console.log("Deployer address:", deployer);

  // 1. Deploy MockUSDT (for testing purposes)
  console.log("📝 Deploying MockUSDT...");
  const mockUSDT = await deploy("MockUSDT", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  // 2. Deploy MockTeleporterMessenger (for local testing)
  console.log("📡 Deploying MockTeleporterMessenger...");
  const teleporterMessenger = await deploy("MockTeleporterMessenger", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  // 3. Deploy RealEstateNFT
  console.log("🏠 Deploying RealEstateNFT...");
  const realEstateNFT = await deploy("RealEstateNFT", {
    from: deployer,
    args: [deployer],
    log: true,
    waitConfirmations: 1,
  });

  // 4. Deploy LendingPool with ICM support
  console.log("🏦 Deploying LendingPool with ICM...");
  const lendingPool = await deploy("LendingPool", {
    from: deployer,
    args: [deployer, mockUSDT.address, teleporterMessenger.address],
    log: true,
    waitConfirmations: 1,
  });

  // Destination blockchain ID for ICM (using a test blockchain ID)
  const destinationBlockchainID = "0x" + "1".repeat(64); // Test blockchain ID

  // 5. Deploy LoanManager with ICM support
  console.log("💰 Deploying LoanManager with ICM...");
  const loanManager = await deploy("LoanManager", {
    from: deployer,
    args: [
      deployer,
      realEstateNFT.address,
      lendingPool.address,
      mockUSDT.address,
      teleporterMessenger.address,
      destinationBlockchainID,
    ],
    log: true,
    waitConfirmations: 1,
  });

  // 5. Deploy AuctionContract
  console.log("🔨 Deploying AuctionContract...");
  const auctionContract = await deploy("AuctionContract", {
    from: deployer,
    args: [deployer, realEstateNFT.address, mockUSDT.address],
    log: true,
    waitConfirmations: 1,
  });

  // 6. Set up contract connections and ICM configuration
  console.log("🔗 Setting up contract connections and ICM...");

  const lendingPoolContract = await ethers.getContractAt("LendingPool", lendingPool.address);

  // Set LoanManager in LendingPool
  console.log("Setting LoanManager in LendingPool...");
  await lendingPoolContract.setLoanManagerContract(loanManager.address);

  console.log("✅ All contracts deployed and configured successfully with ICM!");
  console.log("\n📋 Contract Addresses:");
  console.log("MockUSDT:", mockUSDT.address);
  console.log("MockTeleporterMessenger:", teleporterMessenger.address);
  console.log("RealEstateNFT:", realEstateNFT.address);
  console.log("LendingPool:", lendingPool.address);
  console.log("LoanManager:", loanManager.address);
  console.log("AuctionContract:", auctionContract.address);
  console.log("\n🔧 ICM Configuration:");
  console.log("Destination Blockchain ID:", destinationBlockchainID);

  // Verify contracts on block explorers (if not local network)
  // Skip verification by default to avoid API issues. Use `yarn verify --network sepolia` manually if needed.
  const shouldVerify = process.env.VERIFY_CONTRACTS === "true";

  if (shouldVerify && hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contracts on block explorer...");
    console.log("Note: You can skip verification by not setting VERIFY_CONTRACTS=true");

    const contracts = [
      { name: "MockUSDT", address: mockUSDT.address, args: [] },
      { name: "MockTeleporterMessenger", address: teleporterMessenger.address, args: [] },
      { name: "RealEstateNFT", address: realEstateNFT.address, args: [deployer] },
      {
        name: "LendingPool",
        address: lendingPool.address,
        args: [deployer, mockUSDT.address, teleporterMessenger.address],
      },
      {
        name: "LoanManager",
        address: loanManager.address,
        args: [
          deployer,
          realEstateNFT.address,
          lendingPool.address,
          mockUSDT.address,
          teleporterMessenger.address,
          destinationBlockchainID,
        ],
      },
      {
        name: "AuctionContract",
        address: auctionContract.address,
        args: [deployer, realEstateNFT.address, mockUSDT.address],
      },
    ];

    for (const contract of contracts) {
      try {
        console.log(`Verifying ${contract.name}...`);
        await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: contract.args,
        });
        console.log(`✅ ${contract.name} verified successfully`);
      } catch {
        console.log(`⚠️ ${contract.name} verification skipped due to API issues`);
      }
    }
  } else {
    console.log("\n📋 Contracts deployed successfully!");
    console.log("💡 To verify contracts later, run: yarn verify --network sepolia");
  }

  return true;
};

export default deployContracts;
deployContracts.tags = ["RealEstatePlatform"];
deployContracts.dependencies = [];
deployContracts.id = "deploy_real_estate_platform";
