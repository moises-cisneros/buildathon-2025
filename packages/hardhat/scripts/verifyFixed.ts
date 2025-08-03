import hre from "hardhat";

async function verifyWithCorrectArgs() {
  console.log("🔍 Verificando contratos con argumentos correctos del constructor...\n");

  const deployerAddress = "0x50733b21e6519244dF9649F85698D5ccb2Ce7d62";

  // Direcciones desplegadas
  const addresses = {
    RealEstateNFT: "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea",
    MockUSDT: "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB",
    LendingPool: "0x209f93748cb91a25B45E88429924263111994801",
    LoanManager: "0xb62E82cA414Bf3D20655f90263E009D854Db7760",
    AuctionContract: "0x1CE6c66bE4323F327916E6d95e995cfd808AF8BD",
    MockTeleporterMessenger: "0xE73f5D71C375b959ed562fEe4B6577bE61e8465d",
  };

  try {
    // Verificar LendingPool con 3 argumentos: initialOwner, usdtToken, teleporterMessenger
    console.log("🔍 Verificando LendingPool...");
    await hre.run("verify:verify", {
      address: addresses.LendingPool,
      constructorArguments: [
        deployerAddress, // initialOwner
        addresses.MockUSDT, // _usdtToken
        addresses.MockTeleporterMessenger, // _teleporterMessenger
      ],
    });
    console.log("✅ LendingPool verificado!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ LendingPool ya verificado!");
    } else {
      console.log(`❌ Error LendingPool: ${error.message}`);
    }
  }

  try {
    // Verificar LoanManager con 6 argumentos
    console.log("\n🔍 Verificando LoanManager...");
    await hre.run("verify:verify", {
      address: addresses.LoanManager,
      constructorArguments: [
        deployerAddress, // initialOwner
        addresses.RealEstateNFT, // _realEstateNFT
        addresses.LendingPool, // _lendingPool
        addresses.MockUSDT, // _usdtToken
        addresses.MockTeleporterMessenger, // _teleporterMessenger
        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // _destinationBlockchainID (dummy para testnet)
      ],
    });
    console.log("✅ LoanManager verificado!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ LoanManager ya verificado!");
    } else {
      console.log(`❌ Error LoanManager: ${error.message}`);
    }
  }

  console.log("\n📊 Estado final de verificación:");
  console.log("✅ MockUSDT - Verificado");
  console.log("✅ MockTeleporterMessenger - Verificado");
  console.log("✅ RealEstateNFT - Verificado");
  console.log("✅ AuctionContract - Verificado");
  console.log("🔍 LendingPool - Intentando verificar...");
  console.log("🔍 LoanManager - Intentando verificar...");

  console.log("\n🌐 Ver contratos en Snowtrace:");
  Object.entries(addresses).forEach(([name, address]) => {
    console.log(`${name}: https://testnet.snowtrace.io/address/${address}#code`);
  });
}

async function main() {
  await verifyWithCorrectArgs();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
