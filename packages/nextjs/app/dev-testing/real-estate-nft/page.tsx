"use client";

import { useState } from "react";
import Link from "next/link";

export default function RealEstateNFTTestingPage() {
  const [result, setResult] = useState<string>("");
  const [mintData, setMintData] = useState({
    direccion: "",
    valoracion: "",
    metadataURI: "",
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🏠 Real Estate NFT Testing</h1>
        <Link href="/dev-testing" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Volver
        </Link>
      </div>

      {/* Contract Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 Información del Contrato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Nombre:</strong> Real Estate NFT
            </p>
            <p>
              <strong>Símbolo:</strong> RENFT
            </p>
            <p>
              <strong>Estándar:</strong> ERC-721
            </p>
          </div>
          <div>
            <p>
              <strong>Network:</strong> Localhost (31337)
            </p>
            <p>
              <strong>Estado:</strong> 🟢 Activo
            </p>
            <p>
              <strong>Total Supply:</strong> Ver en Debug
            </p>
          </div>
        </div>
      </div>

      {/* Mint Property NFT */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">🏭 Mint Property NFT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Dirección de la Propiedad</label>
            <input
              type="text"
              value={mintData.direccion}
              onChange={e => setMintData({ ...mintData, direccion: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="123 Main St, Ciudad, País"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valoración (USDT)</label>
            <input
              type="number"
              value={mintData.valoracion}
              onChange={e => setMintData({ ...mintData, valoracion: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="100000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Metadata URI</label>
            <input
              type="text"
              value={mintData.metadataURI}
              onChange={e => setMintData({ ...mintData, metadataURI: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="https://metadata.example.com/property/1"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={() =>
                setResult(`NFT minteado - Propiedad: ${mintData.direccion}, Valor: ${mintData.valoracion} USDT`)
              }
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Mint Property NFT
            </button>
          </div>
        </div>
      </div>

      {/* Testing Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* View Properties */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">👁️ View Properties</h3>
          <p className="text-gray-600 mb-4">Ver propiedades existentes</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Consultando propiedades - Conecta wallet para ver datos reales")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Ver Propiedad
          </button>
        </div>

        {/* Transfer NFT */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">🔄 Transfer NFT</h3>
          <p className="text-gray-600 mb-4">Transferir propiedad</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <input type="text" placeholder="Dirección destino" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Transfer ejecutado - Conecta wallet para transferir realmente")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
          >
            Transferir
          </button>
        </div>

        {/* Set Property Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-600">⚙️ Set Status</h3>
          <p className="text-gray-600 mb-4">Cambiar estado de propiedad</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <select className="w-full border rounded px-3 py-2 mb-3">
            <option value="0">Disponible</option>
            <option value="1">Colateralizada</option>
            <option value="2">En Subasta</option>
          </select>
          <button
            onClick={() => setResult("Estado cambiado - Conecta wallet para funcionalidad completa")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
          >
            Cambiar Estado
          </button>
        </div>

        {/* Approve All */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">✅ Approve Contracts</h3>
          <p className="text-gray-600 mb-4">Aprobar contratos para usar NFTs</p>
          <select className="w-full border rounded px-3 py-2 mb-3">
            <option>LoanManager Contract</option>
            <option>AuctionContract</option>
          </select>
          <button
            onClick={() => setResult("Approval ejecutado - Conecta wallet para aprobar realmente")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Aprobar Todos
          </button>
        </div>

        {/* Get Approved */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">🔍 Check Approved</h3>
          <p className="text-gray-600 mb-4">Ver quién puede usar un NFT</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Consultando approvals - Conecta wallet para ver datos reales")}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full"
          >
            Ver Approved
          </button>
        </div>

        {/* Owner Of */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">👤 Owner Of</h3>
          <p className="text-gray-600 mb-4">Ver propietario de un NFT</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Consultando propietario - Conecta wallet para ver datos reales")}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
          >
            Ver Propietario
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">🏠 Resultado:</h3>
          <p className="text-gray-700">{result}</p>
        </div>
      )}

      {/* Quick Mint Examples */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🚀 Ejemplos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setMintData({
                direccion: "Casa Familiar - 123 Main St",
                valoracion: "150000",
                metadataURI: "https://example.com/casa1",
              });
              setResult("Datos de ejemplo cargados para Casa Familiar");
            }}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200"
          >
            🏡 Casa Familiar ($150k)
          </button>
          <button
            onClick={() => {
              setMintData({
                direccion: "Departamento - 456 Oak Ave",
                valoracion: "80000",
                metadataURI: "https://example.com/depto1",
              });
              setResult("Datos de ejemplo cargados para Departamento");
            }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200"
          >
            🏢 Departamento ($80k)
          </button>
          <button
            onClick={() => {
              setMintData({
                direccion: "Villa de Lujo - 789 Elm St",
                valoracion: "500000",
                metadataURI: "https://example.com/villa1",
              });
              setResult("Datos de ejemplo cargados para Villa de Lujo");
            }}
            className="bg-purple-100 text-purple-800 px-4 py-2 rounded hover:bg-purple-200"
          >
            🏰 Villa de Lujo ($500k)
          </button>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔗 Acceso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dev-testing/loan-manager" className="text-red-600 hover:text-red-800 underline">
            📋 Loan Manager Testing
          </Link>
          <Link href="/dev-testing/auction-contract" className="text-orange-600 hover:text-orange-800 underline">
            🔨 Auction Testing
          </Link>
          <Link href="/debug" className="text-blue-600 hover:text-blue-800 underline">
            🐛 Debug Contracts
          </Link>
        </div>
      </div>
    </div>
  );
}
