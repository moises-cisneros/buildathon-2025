import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface ContractInfo {
  name: string;
  address: string;
  constructorArgs: any[];
}

const deployedContracts: ContractInfo[] = [
  {
    name: "RealEstateNFT",
    address: "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea",
    constructorArgs: ["0x50733b21e6519244dF9649F85698D5ccb2Ce7d62"], // initialOwner
  },
  {
    name: "MockUSDT",
    address: "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB",
    constructorArgs: [],
  },
  {
    name: "LoanManager",
    address: "0xb62E82cA414Bf3D20655f90263E009D854Db7760",
    constructorArgs: [
      "0x50733b21e6519244dF9649F85698D5ccb2Ce7d62", // initialOwner
      "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea", // realEstateNFT
      "0x209f93748cb91a25B45E88429924263111994801", // lendingPool
      "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB", // usdtToken
      "0xE73f5D71C375b959ed562fEe4B6577bE61e8465d", // teleporterMessenger
      "0x0000000000000000000000000000000000000000000000000000000000000001", // destinationBlockchainID
    ],
  },
  {
    name: "LendingPool",
    address: "0x209f93748cb91a25B45E88429924263111994801",
    constructorArgs: [
      "0x50733b21e6519244dF9649F85698D5ccb2Ce7d62", // initialOwner
      "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB", // usdtToken
      "0xE73f5D71C375b959ed562fEe4B6577bE61e8465d", // teleporterMessenger
    ],
  },
  {
    name: "AuctionContract",
    address: "0x1CE6c66bE4323F327916E6d95e995cfd808AF8BD",
    constructorArgs: [
      "0x50733b21e6519244dF9649F85698D5ccb2Ce7d62", // initialOwner
      "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea", // realEstateNFT
      "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB", // usdtToken
    ],
  },
  {
    name: "MockTeleporterMessenger",
    address: "0xE73f5D71C375b959ed562fEe4B6577bE61e8465d",
    constructorArgs: [],
  },
];

async function verifyContract(contract: ContractInfo) {
  try {
    console.log(`\n🔍 Verificando ${contract.name} en ${contract.address}...`);

    const command = `npx hardhat verify --network avalancheFuji ${contract.address} ${contract.constructorArgs.map(arg => `"${arg}"`).join(" ")}`;
    console.log(`Comando: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stdout.includes("successfully verified") || stdout.includes("Already Verified")) {
      console.log(`✅ ${contract.name} verificado exitosamente!`);
      return true;
    } else {
      console.log(`⚠️ ${contract.name} - Verificación incierta:`);
      console.log(stdout);
      if (stderr) console.log("Error:", stderr);
      return false;
    }
  } catch (error: any) {
    if (error.stdout && error.stdout.includes("Already Verified")) {
      console.log(`✅ ${contract.name} ya estaba verificado!`);
      return true;
    }

    console.log(`❌ Error verificando ${contract.name}:`);
    console.log(error.stdout || error.message);

    // Si es problema de versión de compilador, intentar verificación manual
    if (error.stdout && error.stdout.includes("solidity")) {
      console.log(`🔧 Intentando verificación manual para ${contract.name}...`);
      await manualVerification(contract);
    }

    return false;
  }
}

async function manualVerification(contract: ContractInfo) {
  console.log(`\n📋 Verificación Manual para ${contract.name}:`);
  console.log(`Dirección: ${contract.address}`);
  console.log(`Red: Avalanche Fuji (43113)`);
  console.log(`Constructor Args: ${JSON.stringify(contract.constructorArgs)}`);

  // Información para verificación manual en Snowtrace
  console.log(`\n🌐 Para verificación manual en Snowtrace:`);
  console.log(`1. Ve a: https://testnet.snowtrace.io/address/${contract.address}#code`);
  console.log(`2. Click en "Verify and Publish"`);
  console.log(`3. Configuración:`);
  console.log(`   - Compiler Type: Solidity (Single file)`);
  console.log(`   - Compiler Version: v0.8.20+commit.a1b79de6`);
  console.log(`   - License: MIT`);
  console.log(`4. Constructor Arguments:`);

  if (contract.constructorArgs.length > 0) {
    console.log(`   Arguments: ${contract.constructorArgs.map(arg => `"${arg}"`).join(", ")}`);
  } else {
    console.log(`   (No constructor arguments)`);
  }
}

async function main() {
  console.log("🚀 Iniciando verificación manual de contratos en Avalanche Fuji...\n");

  let verified = 0;
  const total = deployedContracts.length;

  for (const contract of deployedContracts) {
    const success = await verifyContract(contract);
    if (success) verified++;

    // Esperar un poco entre verificaciones
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n📊 Resumen de Verificación:`);
  console.log(`✅ Verificados: ${verified}/${total}`);
  console.log(`⏳ Pendientes: ${total - verified}/${total}`);

  if (verified < total) {
    console.log(`\n💡 Para los contratos pendientes, usa la información de verificación manual mostrada arriba.`);
    console.log(`🌐 Snowtrace Fuji: https://testnet.snowtrace.io/`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
