import { ethers } from "hardhat";

async function monitorBalance() {
  const [deployer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("🔍 Monitoreando balance en Avalanche Fuji...");
  console.log("👤 Deployer:", deployer.address);
  console.log("📍 Network: avalancheFuji (Chain ID: 43113)");
  console.log("🔗 Explorer: https://testnet.snowtrace.io/address/" + deployer.address);
  console.log("=".repeat(60));
  
  let attempts = 0;
  const maxAttempts = 30; // 30 attempts = 5 minutes
  
  while (attempts < maxAttempts) {
    try {
      const balance = await provider.getBalance(deployer.address);
      const balanceInAVAX = ethers.formatEther(balance);
      
      console.log(`⏰ Intento ${attempts + 1}/${maxAttempts} - Balance: ${balanceInAVAX} AVAX`);
      
      if (parseFloat(balanceInAVAX) > 0.1) {
        console.log("\n🎉 ¡FONDOS DETECTADOS!");
        console.log(`💰 Balance actual: ${balanceInAVAX} AVAX`);
        console.log("✅ Suficiente para deployment");
        console.log("\n🚀 Ejecuta ahora:");
        console.log("npx hardhat deploy --tags RemainingContracts --network avalancheFuji");
        break;
      }
      
      if (attempts < maxAttempts - 1) {
        console.log("⏳ Esperando 10 segundos...\n");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      }
      
      attempts++;
    } catch (error) {
      console.error("❌ Error:", error);
      attempts++;
    }
  }
  
  if (attempts >= maxAttempts) {
    console.log("\n⏰ Tiempo de espera agotado");
    console.log("💡 Los fondos pueden tomar más tiempo en llegar");
    console.log("🔗 Verifica en: https://testnet.snowtrace.io/address/" + deployer.address);
  }
}

monitorBalance()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
