import hre from "hardhat";
import fs from "fs";
import path from "path";

async function getDeployedAddresses() {
  const network = hre.network.name;
  const deploymentPath = path.join(__dirname, `../deployments/${network}`);

  console.log(`📋 Obteniendo direcciones de contratos desplegados en ${network}...\n`);

  const contracts = [
    "RealEstateNFT",
    "MockUSDT",
    "LoanManager",
    "LendingPool",
    "AuctionContract",
    "MockTeleporterMessenger",
  ];

  const addresses: { [key: string]: string } = {};

  for (const contractName of contracts) {
    try {
      const deploymentFile = path.join(deploymentPath, `${contractName}.json`);

      if (fs.existsSync(deploymentFile)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
        addresses[contractName] = deployment.address;
        console.log(`✅ ${contractName}: ${deployment.address}`);

        // Verificar si el contrato está desplegado
        const code = await hre.ethers.provider.getCode(deployment.address);
        if (code === "0x") {
          console.log(`   ⚠️  Sin bytecode - contrato no desplegado`);
        } else {
          console.log(`   ✅ Bytecode confirmado (${code.length} chars)`);
        }
      } else {
        console.log(`❌ ${contractName}: No encontrado en deployments`);
      }
    } catch (error) {
      console.log(`❌ Error obteniendo ${contractName}: ${error}`);
    }

    console.log("");
  }

  return addresses;
}

async function verifyContract(name: string, address: string, constructorArgs: any[] = []) {
  try {
    console.log(`🔍 Verificando ${name} en ${address}...`);

    // Verificar si el contrato tiene bytecode
    const code = await hre.ethers.provider.getCode(address);
    if (code === "0x") {
      console.log(`❌ ${name}: No hay bytecode en esta dirección`);
      return false;
    }

    const constructorArgsString = constructorArgs.map(arg => `"${arg}"`).join(" ");
    console.log(`   Constructor args: ${constructorArgsString || "(none)"}`);

    await hre.run("verify:verify", {
      address: address,
      constructorArguments: constructorArgs,
    });

    console.log(`✅ ${name} verificado exitosamente!`);
    return true;
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`✅ ${name} ya estaba verificado!`);
      return true;
    } else if (error.message.includes("solidity")) {
      console.log(`⚠️ ${name}: Problema de versión del compilador`);
      console.log(`   Verificación manual requerida en: https://testnet.snowtrace.io/address/${address}#code`);
    } else {
      console.log(`❌ Error verificando ${name}: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  console.log("🚀 Script de verificación de contratos Avalanche Fuji\n");

  // Obtener direcciones actuales
  const addresses = await getDeployedAddresses();

  if (Object.keys(addresses).length === 0) {
    console.log("❌ No se encontraron contratos desplegados. Ejecuta 'yarn deploy' primero.");
    return;
  }

  console.log("\n🔍 Iniciando proceso de verificación...\n");

  // Verificar cada contrato con sus argumentos del constructor
  const verifications = [
    {
      name: "MockUSDT",
      address: addresses.MockUSDT,
      args: [],
    },
    {
      name: "MockTeleporterMessenger",
      address: addresses.MockTeleporterMessenger,
      args: [],
    },
    {
      name: "RealEstateNFT",
      address: addresses.RealEstateNFT,
      args: [addresses.RealEstateNFT], // initialOwner (se usa la propia dirección del contrato en algunos casos)
    },
    {
      name: "LendingPool",
      address: addresses.LendingPool,
      args: [
        addresses.MockUSDT || "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB",
        addresses.MockTeleporterMessenger || "0xe73f5d71c375b959ed562fee4b6577be61e8465d",
      ],
    },
    {
      name: "LoanManager",
      address: addresses.LoanManager,
      args: [
        addresses.RealEstateNFT || "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea",
        addresses.LendingPool || "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0",
        addresses.MockTeleporterMessenger || "0xe73f5d71c375b959ed562fee4b6577be61e8465d",
      ],
    },
    {
      name: "AuctionContract",
      address: addresses.AuctionContract,
      args: [
        addresses.RealEstateNFT || "0x50674B8a415Df34Dd692DEd8981dc5f08437e7Ea",
        addresses.MockUSDT || "0x8Fc392C3B5607Aeeaae2565d81c9be11A0a649aB",
      ],
    },
  ];

  let verified = 0;

  for (const verification of verifications) {
    if (verification.address) {
      const success = await verifyContract(verification.name, verification.address, verification.args);
      if (success) verified++;

      // Esperar entre verificaciones
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("");
    } else {
      console.log(`⏭️  Saltando ${verification.name} - no desplegado\n`);
    }
  }

  console.log(`\n📊 Resumen Final:`);
  console.log(`✅ Verificados: ${verified}/${verifications.length}`);
  console.log(`⏳ Pendientes: ${verifications.length - verified}/${verifications.length}`);

  console.log(`\n🌐 Snowtrace Fuji: https://testnet.snowtrace.io/`);
  console.log(`📖 Documentación: README-HACKATHON.md`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
