"use client";

import Link from "next/link";

export default function DevTestingPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🔧 Interfaz de Testing para Desarrolladores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock USDT Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">💰 Mock USDT</h2>
          <p className="text-gray-600 mb-4">Testear funciones del token USDT</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Mint tokens</li>
            <li>• Check balance</li>
            <li>• Transfer tokens</li>
            <li>• Approve contracts</li>
          </ul>
          <Link
            href="/dev-testing/mock-usdt"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Probar USDT
          </Link>
        </div>

        {/* Real Estate NFT Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-green-600">🏠 Real Estate NFT</h2>
          <p className="text-gray-600 mb-4">Testear funciones del NFT</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Mint properties</li>
            <li>• View properties</li>
            <li>• Transfer NFTs</li>
            <li>• Set property status</li>
          </ul>
          <div className="space-y-2">
            <Link
              href="/dev-testing/real-estate-nft"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block w-full text-center"
            >
              Probar NFT Básico
            </Link>
            <Link
              href="/dev-testing/real-estate-nft-advanced"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block w-full text-center"
            >
              🌐 NFT + Pinata IPFS
            </Link>
          </div>
        </div>

        {/* Lending Pool Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🏦 Lending Pool</h2>
          <p className="text-gray-600 mb-4">Testear pool de préstamos</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Deposit USDT</li>
            <li>• Withdraw USDT</li>
            <li>• Check pool balance</li>
            <li>• Fund loans</li>
          </ul>
          <Link
            href="/dev-testing/lending-pool"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block"
          >
            Probar Pool
          </Link>
        </div>

        {/* Loan Manager Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-red-600">📋 Loan Manager</h2>
          <p className="text-gray-600 mb-4">Testear gestión de préstamos</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Create loans</li>
            <li>• Repay loans</li>
            <li>• Complete loans</li>
            <li>• Transfer to auction</li>
          </ul>
          <Link
            href="/dev-testing/loan-manager"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block"
          >
            Probar Loans
          </Link>
        </div>

        {/* Auction Contract Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">🔨 Auction Contract</h2>
          <p className="text-gray-600 mb-4">Testear subastas</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Start auctions</li>
            <li>• Complete auctions</li>
            <li>• Transfer NFTs</li>
            <li>• Distribute funds</li>
          </ul>
          <Link
            href="/dev-testing/auction-contract"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block"
          >
            Probar Auction
          </Link>
        </div>

        {/* Full Workflow Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">🔄 Full Workflow</h2>
          <p className="text-gray-600 mb-4">Testear flujo completo</p>
          <ul className="text-sm text-gray-500 mb-4">
            <li>• Mint NFT → Loan → Repay</li>
            <li>• Mint NFT → Loan → Auction</li>
            <li>• Pool operations</li>
            <li>• Complete scenarios</li>
          </ul>
          <Link
            href="/dev-testing/full-workflow"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 inline-block"
          >
            Probar Workflow
          </Link>
        </div>

        {/* ICM Testing - NEW */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 border border-purple-300">
          <h2 className="text-xl font-semibold mb-4 text-white">🌐 ICM Testing</h2>
          <p className="text-purple-100 mb-4">Avalanche Inter-Contract Messaging</p>
          <ul className="text-sm text-purple-200 mb-4">
            <li>• Automated interest distribution</li>
            <li>• Cross-chain messaging</li>
            <li>• Asynchronous processes</li>
            <li>• Professional architecture</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dev-testing/icm-testing"
              className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100 inline-block font-semibold"
            >
              🚀 Probar ICM
            </Link>
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">NEW</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Estado Actual de Contratos</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Contratos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">✅</div>
            <div className="text-sm text-gray-600">Compilados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">🌐</div>
            <div className="text-sm text-gray-600">Red Local</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">🧪</div>
            <div className="text-sm text-gray-600">Testing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">⚡</div>
            <div className="text-sm text-gray-600">Minimal Gas</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 text-center">
        <Link href="/debug" className="mr-4 text-blue-600 hover:text-blue-800 underline">
          🐛 Debug Page
        </Link>
        <Link href="/blockexplorer" className="mr-4 text-green-600 hover:text-green-800 underline">
          ⛓️ Block Explorer
        </Link>
        <Link href="/" className="text-purple-600 hover:text-purple-800 underline">
          🏠 Página Principal
        </Link>
      </div>
    </div>
  );
}
