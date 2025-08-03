# 🏔️ Deployment en Avalanche (C-Chain)

Este documento explica cómo deployar los contratos del Real Estate Lending Platform en Avalanche C-Chain.

## 📋 Pre-requisitos

### 1. Configurar Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
# API Keys
SNOWTRACE_API_KEY=your_snowtrace_api_key  # Obtén en https://snowtrace.io/apis
ALCHEMY_API_KEY=your_alchemy_key          # Opcional, pero recomendado

# Private Key encriptada (generada automáticamente)
DEPLOYER_PRIVATE_KEY_ENCRYPTED=...
```

### 2. Generar/Configurar Account Deployer

```bash
# Generar nueva cuenta
yarn generate

# O importar cuenta existente
yarn account:import
```

### 3. Obtener AVAX para Gas

#### Testnet (Fuji):
- Usa el faucet oficial: https://faucet.avax.network/
- Obtén hasta 2 AVAX cada 24 horas
- Network: Avalanche Fuji C-Chain
- Chain ID: 43113

#### Mainnet:
- Compra AVAX en exchanges como Coinbase, Binance, etc.
- Envía a tu wallet de deployment

## 🚀 Deployment

### Testnet (Fuji)

```bash
# Deployar en Fuji testnet
yarn deploy --network avalancheFuji

# Verificar contratos (opcional)
yarn verify --network avalancheFuji
```

### Mainnet

```bash
# Deployar en Avalanche mainnet
yarn deploy --network avalanche

# Verificar contratos
yarn verify --network avalanche
```

## 📊 Costos Estimados

### Testnet (Fuji):
- Gas Price: ~25 gwei
- Costo total estimado: ~0.5 AVAX ($15-25 USD)

### Mainnet:
- Gas Price: ~25 gwei  
- Costo total estimado: ~0.5 AVAX ($15-25 USD)

*Nota: Los costos pueden variar según la congestión de la red*

## 🔗 Exploradores de Bloques

### Testnet:
- **AvaTrace**: https://testnet.avascan.info/blockchain/c
- **Snowtrace**: https://testnet.snowtrace.io/

### Mainnet:
- **AvaTrace**: https://avascan.info/blockchain/c  
- **Snowtrace**: https://snowtrace.io/

## 📋 Post-Deployment

### 1. Verificar Deployment

```bash
# Ver lista de contratos deployados
yarn hardhat deployments --network avalancheFuji

# Verificar en Snowtrace
yarn verify --network avalancheFuji
```

### 2. Actualizar Frontend

Los contratos deployados se actualizan automáticamente en:
- `packages/nextjs/contracts/deployedContracts.ts`

### 3. Configurar ICM (Opcional)

Para ICM en producción necesitarías:
- Configurar el TeleporterMessenger real de Avalanche
- Configurar relayers para automatización
- Actualizar blockchain IDs en los contratos

## ⚠️ Consideraciones Importantes

### Diferencias con Localhost:
1. **Gas Real**: Los deployments consumen AVAX real
2. **Confirmaciones**: Las transacciones pueden tomar 1-3 segundos
3. **Finalidad**: Las transacciones son irreversibles
4. **ICM**: Necesitarías configurar infraestructura ICM real

### Seguridad:
1. **Private Keys**: Nunca compartas tu private key
2. **Verificación**: Siempre verifica contratos después del deployment
3. **Testing**: Prueba exhaustivamente en testnet antes de mainnet

## 🛠️ Comandos Útiles

```bash
# Ver estado de deployment
yarn hardhat deployments --network avalancheFuji

# Ejecutar scripts personalizados
yarn hardhat run scripts/customScript.ts --network avalancheFuji

# Verificar balance del deployer
yarn hardhat run scripts/checkBalance.ts --network avalancheFuji

# Listar cuentas
yarn account:list
```

## 🆘 Troubleshooting

### Error: "insufficient funds"
- Verifica que tienes suficiente AVAX en tu wallet
- Usa el faucet de Fuji si es testnet

### Error: "nonce too high"
- Reset el nonce en MetaMask: Settings > Advanced > Reset Account

### Error: "network not supported"
- Verifica que el network está correctamente configurado en `hardhat.config.ts`

### Error de verificación
- Espera unos minutos después del deployment
- Verifica que tienes el API key correcto de Snowtrace

## 📞 Soporte

- **Avalanche Docs**: https://docs.avax.network/
- **Discord**: https://chat.avalabs.org/
- **Forums**: https://forum.avalabs.org/
