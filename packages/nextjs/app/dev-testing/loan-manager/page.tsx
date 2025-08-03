"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoanManagerTestingPage() {
  const [result, setResult] = useState<string>("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📋 Loan Manager Testing</h1>
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
              <strong>Función:</strong> Gestión de Préstamos
            </p>
            <p>
              <strong>Tipo:</strong> Ultra-minimalista
            </p>
            <p>
              <strong>Custodia:</strong> NFTs como colateral
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
              <strong>Modo:</strong> Solo transferencias
            </p>
          </div>
        </div>
      </div>

      {/* Main Functions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Create Loan */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">🏦 Create Loan</h3>
          <p className="text-gray-600 mb-4">Crear préstamo con NFT como colateral</p>
          <div className="space-y-3">
            <input type="number" placeholder="Token ID del NFT" className="w-full border rounded px-3 py-2" />
            <input type="number" placeholder="Monto del préstamo (USDT)" className="w-full border rounded px-3 py-2" />
            <button
              onClick={() => setResult("Préstamo creado - NFT transferido a custodia, USDT enviado al borrower")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Crear Préstamo
            </button>
          </div>
        </div>

        {/* Repay Loan */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">💰 Repay Loan</h3>
          <p className="text-gray-600 mb-4">Pagar préstamo existente</p>
          <div className="space-y-3">
            <input type="number" placeholder="Token ID del NFT" className="w-full border rounded px-3 py-2" />
            <input type="number" placeholder="Monto a pagar (USDT)" className="w-full border rounded px-3 py-2" />
            <button
              onClick={() => setResult("Pago procesado - USDT transferido al pool")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Pagar Préstamo
            </button>
          </div>
        </div>
      </div>

      {/* Admin Functions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">🔧 Funciones de Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complete Loan */}
          <div>
            <h4 className="font-medium mb-2">✅ Complete Loan</h4>
            <p className="text-sm text-gray-600 mb-3">Completar préstamo y devolver NFT</p>
            <div className="space-y-2">
              <input type="number" placeholder="Token ID del NFT" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Préstamo completado - NFT devuelto al propietario original")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                Completar Préstamo
              </button>
            </div>
          </div>

          {/* Transfer to Auction */}
          <div>
            <h4 className="font-medium mb-2">🔨 Transfer to Auction</h4>
            <p className="text-sm text-gray-600 mb-3">Transferir NFT a subasta (default)</p>
            <div className="space-y-2">
              <input type="number" placeholder="Token ID del NFT" className="w-full border rounded px-3 py-2" />
              <input
                type="text"
                placeholder="Dirección del contrato de subasta"
                className="w-full border rounded px-3 py-2"
              />
              <button
                onClick={() => setResult("NFT transferido a subasta por incumplimiento")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
              >
                Transferir a Subasta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Functions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Check NFT Owner */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">👤 NFT Owner</h3>
          <p className="text-gray-600 mb-4">Ver propietario original</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Consultando propietario original del NFT")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
          >
            Ver Owner
          </button>
        </div>

        {/* Check Active Loan */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-600">🔍 Active Loan</h3>
          <p className="text-gray-600 mb-4">Verificar préstamo activo</p>
          <input type="number" placeholder="Token ID" className="w-full border rounded px-3 py-2 mb-3" />
          <button
            onClick={() => setResult("Verificando estado del préstamo")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
          >
            Check Loan
          </button>
        </div>

        {/* Contract Balances */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">💼 Balances</h3>
          <p className="text-gray-600 mb-4">Ver balances del contrato</p>
          <div className="space-y-2">
            <button
              onClick={() => setResult("Consultando balance de USDT del contrato")}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full"
            >
              USDT Balance
            </button>
            <button
              onClick={() => setResult("Consultando NFTs en custodia")}
              className="bg-indigo-400 text-white px-4 py-2 rounded hover:bg-indigo-500 w-full"
            >
              NFTs en Custodia
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Examples */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🔄 Flujos de Trabajo Típicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-green-600 mb-2">✅ Flujo Exitoso</h4>
            <ol className="text-sm space-y-1">
              <li>1. Usuario tiene NFT y necesita liquidez</li>
              <li>2. CreateLoan(tokenId, amount) - NFT va a custodia</li>
              <li>3. Usuario recibe USDT del pool</li>
              <li>4. Usuario paga: RepayLoan(tokenId, amount)</li>
              <li>5. Admin: CompleteLoan(tokenId) - NFT devuelto</li>
            </ol>
          </div>

          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-red-600 mb-2">⚠️ Flujo de Default</h4>
            <ol className="text-sm space-y-1">
              <li>1. Usuario tiene NFT y necesita liquidez</li>
              <li>2. CreateLoan(tokenId, amount) - NFT va a custodia</li>
              <li>3. Usuario recibe USDT del pool</li>
              <li>4. Usuario no paga (lógica off-chain detecta)</li>
              <li>5. Admin: TransferToAuction(tokenId, auctionAddress)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">📊 Resultado:</h3>
          <p className="text-gray-700">{result}</p>
        </div>
      )}

      {/* Quick Access */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔗 Acceso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dev-testing/real-estate-nft" className="text-green-600 hover:text-green-800 underline">
            🏠 NFT Testing
          </Link>
          <Link href="/dev-testing/lending-pool" className="text-purple-600 hover:text-purple-800 underline">
            🏦 Pool Testing
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
