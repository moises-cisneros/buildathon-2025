async function showAvalancheNetworkInfo() {
  console.log("🔧 Configuración de MetaMask para Avalanche");
  console.log("=".repeat(50));

  console.log("\n📋 Para agregar Avalanche Fuji Testnet a MetaMask:\n");

  console.log("Network Name: Avalanche Fuji Testnet");
  console.log("New RPC URL: https://api.avax-test.network/ext/bc/C/rpc");
  console.log("Chain ID: 43113");
  console.log("Currency Symbol: AVAX");
  console.log("Block Explorer URL: https://testnet.avascan.info/blockchain/c");

  console.log("\n📋 Para agregar Avalanche Mainnet a MetaMask:\n");

  console.log("Network Name: Avalanche Network C-Chain");
  console.log("New RPC URL: https://api.avax.network/ext/bc/C/rpc");
  console.log("Chain ID: 43114");
  console.log("Currency Symbol: AVAX");
  console.log("Block Explorer URL: https://avascan.info/blockchain/c");

  console.log("\n🚰 Faucet para Testnet:");
  console.log("https://faucet.avax.network/");

  console.log("\n🔗 Recursos útiles:");
  console.log("- Documentación: https://docs.avax.network/");
  console.log("- Discord: https://chat.avalabs.org/");
  console.log("- Twitter: https://twitter.com/avalancheavax");
}

showAvalancheNetworkInfo().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
