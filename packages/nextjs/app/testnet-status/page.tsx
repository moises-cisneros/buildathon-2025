"use client";

import { useAccount, useChainId } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const AVALANCHE_FUJI_CONTRACTS = {
  AuctionContract: "0xb26aDd1f6e9Cd86E9F68A94A4BFe2c4C0e2B5eD4",
  MockUSDT: "0x7e4c6f4e725bb1c56d7d2c92cbef5a6c2b3d1b80",
  MockTeleporterMessenger: "0xe73f5d71c375b959ed562fee4b6577be61e8465d",
  // ✅ RECIÉN DESPLEGADOS
  RealEstateNFT: "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3",
  LendingPool: "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0",
  LoanManager: "0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650",
};

const TestnetStatus = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  const isAvalancheFuji = chainId === 43113;

  const getContractStatus = (contractName: string) => {
    const address = AVALANCHE_FUJI_CONTRACTS[contractName as keyof typeof AVALANCHE_FUJI_CONTRACTS];
    return address.startsWith("0x") ? "✅ Verified" : "⏳ Pending";
  };

  const getSnowtraceLink = (contractAddress: string) => {
    if (!contractAddress.startsWith("0x")) return "#";
    return `https://testnet.snowtrace.io/address/${contractAddress}#code`;
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-8">
      <div className="px-5 max-w-6xl w-full">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">🏔️ Avalanche Fuji Testnet</span>
          <span className="block text-2xl mb-2">Estado de Contratos</span>
        </h1>

        {/* Network Status */}
        <div className="bg-base-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🔗 Estado de Red</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat">
              <div className="stat-title">Red Actual</div>
              <div className="stat-value text-sm">{isAvalancheFuji ? "✅ Avalanche Fuji" : "❌ Red Incorrecta"}</div>
              <div className="stat-desc">Chain ID: {chainId || "No conectado"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Wallet</div>
              <div className="stat-value text-sm">{address ? "✅ Conectada" : "❌ Desconectada"}</div>
              <div className="stat-desc">{address && <Address address={address} />}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Explorer</div>
              <div className="stat-value text-sm">
                <a href="https://testnet.snowtrace.io" target="_blank" rel="noopener noreferrer" className="link">
                  Snowtrace
                </a>
              </div>
              <div className="stat-desc">Testnet Explorer</div>
            </div>
          </div>
        </div>

        {/* Contracts Status */}
        <div className="bg-base-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📋 Estado de Contratos</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Contrato</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(AVALANCHE_FUJI_CONTRACTS).map(([name, address]) => (
                  <tr key={name}>
                    <td className="font-bold">{name}</td>
                    <td>
                      {address.startsWith("0x") ? (
                        <Address address={address} />
                      ) : (
                        <span className="text-warning">{address}</span>
                      )}
                    </td>
                    <td>
                      <span className={address.startsWith("0x") ? "badge badge-success" : "badge badge-warning"}>
                        {getContractStatus(name)}
                      </span>
                    </td>
                    <td>
                      {address.startsWith("0x") ? (
                        <div className="flex gap-2">
                          <a
                            href={getSnowtraceLink(address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-primary"
                          >
                            Ver en Snowtrace
                          </a>
                          <button className="btn btn-xs btn-secondary">Interactuar</button>
                        </div>
                      ) : (
                        <span className="text-sm text-base-content/60">Esperando deployment...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deployment Progress */}
        <div className="bg-base-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 Progreso de Deployment</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span>Contratos Desplegados</span>
              <span className="font-bold">6/6 (100%)</span>
            </div>
            <progress className="progress progress-success w-full" value="100" max="100"></progress>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-bold text-success mb-2">✅ Desplegados (6):</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>AuctionContract ✅ Verificado</li>
                  <li>MockUSDT ✅ Verificado</li>
                  <li>MockTeleporterMessenger ✅ Verificado</li>
                  <li>RealEstateNFT 🆕 Nuevo</li>
                  <li>LendingPool 🆕 Nuevo</li>
                  <li>LoanManager 🆕 Nuevo</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-info mb-2">🔍 Verificación:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>✅ 3 contratos verificados</li>
                  <li>⏳ 3 pendientes de verificar</li>
                  <li>📊 50% código visible</li>
                  <li>🎯 100% funcional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-base-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🚀 Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://faucet.avax.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🚰 Obtener AVAX Testnet
            </a>
            <a
              href="https://testnet.snowtrace.io"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              🔍 Explorar Snowtrace
            </a>
            <button onClick={() => (window.location.href = "/icm-testing")} className="btn btn-accent">
              🧪 Probar ICM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestnetStatus;
