import { ethers } from "hardhat";
import { formatEther } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("🔍 Verificando balance del deployer...");
  console.log("Deployer address:", deployer.address);
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = formatEther(balance);
  
  console.log(`💰 Balance: ${balanceInEth} ${getNetworkCurrency(network.chainId)}`);
  
  // Verificar si el balance es suficiente para deployment
  const minimumRequired = "0.5"; // AVAX/ETH
  if (parseFloat(balanceInEth) < parseFloat(minimumRequired)) {
    console.log(`⚠️ ADVERTENCIA: Balance insuficiente para deployment`);
    console.log(`💡 Se recomienda tener al menos ${minimumRequired} ${getNetworkCurrency(network.chainId)}`);
    
    if (network.chainId === 43113n) { // Fuji testnet
      console.log("🚰 Obtén AVAX de prueba en: https://faucet.avax.network/");
    }
  } else {
    console.log(`✅ Balance suficiente para deployment`);
  }
}

function getNetworkCurrency(chainId: bigint): string {
  switch (chainId) {
    case 43113n: // Fuji
    case 43114n: // Avalanche
      return "AVAX";
    case 1n: // Ethereum
    case 11155111n: // Sepolia
      return "ETH";
    case 137n: // Polygon
      return "MATIC";
    default:
      return "ETH";
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
