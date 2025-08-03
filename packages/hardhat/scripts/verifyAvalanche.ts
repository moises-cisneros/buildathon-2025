async function main() {
  console.log("🔍 Script de Verificación para Avalanche Fuji");
  console.log("=".repeat(50));

  // Direcciones de los contratos deployados
  const contracts = {
    MockUSDT: "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB",
    MockTeleporterMessenger: "0xE73f5D71C375b959ed562fEe4B6577bE61e8465d",
    RealEstateNFT: "0x35B5d6abBf6E51d3fED0C08B894CFA6F411933B0",
    LendingPool: "0x9319d39B3774e7fAc5912925F19F4bb4D45a9Cc8",
    LoanManager: "0x249317d32Efa12b64e395B5352f351fE53d961a5",
    AuctionContract: "0x1CE6c66bE4323F327916E6d95e995cfd808AF8BD", // Ya verificado
  };

  const deployerAddress = "0x50733b21e6519244dF9649F85698D5ccb2Ce7d62";

  console.log("\n📋 Comandos para verificar cada contrato:\n");

  console.log("1. MockUSDT (sin parámetros):");
  console.log(`npx hardhat verify --network avalancheFuji ${contracts.MockUSDT}`);

  console.log("\n2. MockTeleporterMessenger (sin parámetros):");
  console.log(`npx hardhat verify --network avalancheFuji ${contracts.MockTeleporterMessenger}`);

  console.log("\n3. RealEstateNFT (parámetro: deployer address):");
  console.log(`npx hardhat verify --network avalancheFuji ${contracts.RealEstateNFT} ${deployerAddress}`);

  console.log("\n4. LendingPool (parámetros: deployer, MockUSDT, MockTeleporter):");
  console.log(
    `npx hardhat verify --network avalancheFuji ${contracts.LendingPool} ${deployerAddress} ${contracts.MockUSDT} ${contracts.MockTeleporterMessenger}`,
  );

  console.log(
    "\n5. LoanManager (parámetros: deployer, RealEstateNFT, LendingPool, MockUSDT, MockTeleporter, blockchainID):",
  );
  const blockchainID = "0x1111111111111111111111111111111111111111111111111111111111111111";
  console.log(
    `npx hardhat verify --network avalancheFuji ${contracts.LoanManager} ${deployerAddress} ${contracts.RealEstateNFT} ${contracts.LendingPool} ${contracts.MockUSDT} ${contracts.MockTeleporterMessenger} ${blockchainID}`,
  );

  console.log("\n6. AuctionContract (ya verificado ✅):");
  console.log(`https://testnet.snowtrace.io/address/${contracts.AuctionContract}#code`);

  console.log("\n💡 Para verificar todos automáticamente, ejecuta:");
  console.log("yarn verify --network avalancheFuji");

  console.log("\n🔗 Ver contratos en Snowtrace:");
  for (const [name, address] of Object.entries(contracts)) {
    console.log(`${name}: https://testnet.snowtrace.io/address/${address}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
