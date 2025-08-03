"use client";

import { useState } from "react";
import Link from "next/link";

export default function FullWorkflowTestingPage() {
  const [result, setResult] = useState<string>("");
  const [step, setStep] = useState(1);

  const workflows = {
    successful: [
      "1. 🏠 Mint Real Estate NFT",
      "2. 💰 Mint USDT tokens",
      "3. 🏦 Deposit USDT to Lending Pool",
      "4. ✅ Approve LoanManager for NFT",
      "5. 📋 Create Loan (NFT → Custodia)",
      "6. 💸 Repay Loan",
      "7. ✅ Complete Loan (Return NFT)",
    ],
    default: [
      "1. 🏠 Mint Real Estate NFT",
      "2. 💰 Mint USDT tokens",
      "3. 🏦 Deposit USDT to Lending Pool",
      "4. ✅ Approve LoanManager for NFT",
      "5. 📋 Create Loan (NFT → Custodia)",
      "6. ⏰ Time passes - No repayment",
      "7. 🔨 Transfer NFT to Auction",
      "8. 🏆 Complete Auction",
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🔄 Full Workflow Testing</h1>
        <Link href="/dev-testing" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← Volver
        </Link>
      </div>

      {/* Workflow Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Successful Workflow */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 text-green-600">✅ Flujo Exitoso</h2>
          <p className="text-gray-600 mb-4">Usuario paga el préstamo y recupera su NFT</p>
          <div className="space-y-2 mb-4">
            {workflows.successful.map((stepText, index) => (
              <div key={index} className={`text-sm ${step > index ? "text-green-600" : "text-gray-500"}`}>
                {stepText}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setStep(1);
              setResult("Iniciando flujo exitoso - Paso a paso");
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Iniciar Flujo Exitoso
          </button>
        </div>

        {/* Default Workflow */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 text-red-600">⚠️ Flujo de Default</h2>
          <p className="text-gray-600 mb-4">Usuario no paga y NFT va a subasta</p>
          <div className="space-y-2 mb-4">
            {workflows.default.map((stepText, index) => (
              <div key={index} className={`text-sm ${step > index ? "text-red-600" : "text-gray-500"}`}>
                {stepText}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setStep(1);
              setResult("Iniciando flujo de default - Paso a paso");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Iniciar Flujo Default
          </button>
        </div>
      </div>

      {/* Step by Step Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Acciones Paso a Paso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Mint NFT */}
          <div className="bg-green-50 rounded p-4">
            <h3 className="font-semibold text-green-700 mb-2">1. 🏠 Mint NFT</h3>
            <input placeholder="Dirección propiedad" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
            <input placeholder="Valoración USDT" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
            <button
              onClick={() => setResult("NFT minteado - Token ID: 1, Propietario: tu wallet")}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm w-full"
            >
              Mint NFT
            </button>
          </div>

          {/* Step 2: Mint USDT */}
          <div className="bg-blue-50 rounded p-4">
            <h3 className="font-semibold text-blue-700 mb-2">2. 💰 Mint USDT</h3>
            <input placeholder="Cantidad USDT" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
            <button
              onClick={() => setResult("USDT minteado - Balance actualizado")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-full"
            >
              Mint USDT
            </button>
          </div>

          {/* Step 3: Pool Deposit */}
          <div className="bg-purple-50 rounded p-4">
            <h3 className="font-semibold text-purple-700 mb-2">3. 🏦 Pool Deposit</h3>
            <input placeholder="Cantidad USDT" className="w-full border rounded px-2 py-1 mb-2 text-sm" />
            <button
              onClick={() => setResult("USDT depositado al pool - Liquidez disponible")}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm w-full"
            >
              Deposit
            </button>
          </div>

          {/* Step 4: Approve */}
          <div className="bg-orange-50 rounded p-4">
            <h3 className="font-semibold text-orange-700 mb-2">4. ✅ Approvals</h3>
            <div className="space-y-1">
              <button
                onClick={() => setResult("NFT aprobado para LoanManager")}
                className="bg-orange-500 text-white px-2 py-1 rounded text-xs w-full"
              >
                Approve NFT
              </button>
              <button
                onClick={() => setResult("USDT aprobado para Pool")}
                className="bg-orange-400 text-white px-2 py-1 rounded text-xs w-full"
              >
                Approve USDT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Operations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 Operaciones de Préstamo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Loan */}
          <div>
            <h3 className="font-semibold text-green-600 mb-2">🏦 Create Loan</h3>
            <div className="space-y-2">
              <input placeholder="Token ID" className="w-full border rounded px-3 py-2" />
              <input placeholder="Loan Amount" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Préstamo creado - NFT en custodia, USDT enviado")}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Create Loan
              </button>
            </div>
          </div>

          {/* Repay Loan */}
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">💰 Repay Loan</h3>
            <div className="space-y-2">
              <input placeholder="Token ID" className="w-full border rounded px-3 py-2" />
              <input placeholder="Repay Amount" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Préstamo pagado - USDT transferido al pool")}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Repay Loan
              </button>
            </div>
          </div>

          {/* Complete or Auction */}
          <div>
            <h3 className="font-semibold text-purple-600 mb-2">🔄 Complete/Auction</h3>
            <div className="space-y-2">
              <input placeholder="Token ID" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Préstamo completado - NFT devuelto")}
                className="bg-green-500 text-white px-4 py-2 rounded w-full mb-1"
              >
                Complete Loan
              </button>
              <button
                onClick={() => setResult("NFT transferido a subasta")}
                className="bg-red-500 text-white px-4 py-2 rounded w-full"
              >
                To Auction
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Operations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔨 Operaciones de Subasta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complete Auction */}
          <div>
            <h3 className="font-semibold text-orange-600 mb-2">🏆 Complete Auction</h3>
            <div className="space-y-2">
              <input placeholder="Token ID" className="w-full border rounded px-3 py-2" />
              <input placeholder="Winner Address" className="w-full border rounded px-3 py-2" />
              <input placeholder="Winning Amount" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Subasta completada - NFT al ganador, USDT distribuido")}
                className="bg-orange-500 text-white px-4 py-2 rounded w-full"
              >
                Complete Auction
              </button>
            </div>
          </div>

          {/* Transfer Funds */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">💸 Transfer Funds</h3>
            <div className="space-y-2">
              <input placeholder="Recipient Address" className="w-full border rounded px-3 py-2" />
              <input placeholder="Amount USDT" className="w-full border rounded px-3 py-2" />
              <button
                onClick={() => setResult("Fondos transferidos según distribución")}
                className="bg-indigo-500 text-white px-4 py-2 rounded w-full"
              >
                Transfer Funds
              </button>
            </div>
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
        <h3 className="text-lg font-semibold mb-4">🔗 Testing Individual</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dev-testing/mock-usdt" className="text-blue-600 hover:text-blue-800 underline">
            💰 USDT Testing
          </Link>
          <Link href="/dev-testing/real-estate-nft" className="text-green-600 hover:text-green-800 underline">
            🏠 NFT Testing
          </Link>
          <Link href="/dev-testing/loan-manager" className="text-red-600 hover:text-red-800 underline">
            📋 Loan Testing
          </Link>
          <Link href="/debug" className="text-purple-600 hover:text-purple-800 underline">
            🐛 Debug All
          </Link>
        </div>
      </div>
    </div>
  );
}
