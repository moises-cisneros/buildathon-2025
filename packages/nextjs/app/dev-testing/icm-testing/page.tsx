"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function ICMTestingPage() {
  const { address: connectedAddress } = useAccount();
  const [tokenId, setTokenId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [messageId, setMessageId] = useState("");
  const [step, setStep] = useState(1);

  // Get contract info
  const { data: loanManagerContract } = useDeployedContractInfo("LoanManager");
  const { data: lendingPoolContract } = useDeployedContractInfo("LendingPool");
  // Get teleporter contract info
  const { data: teleporterContract } = useDeployedContractInfo("MockTeleporterMessenger");

  // ICM Testing Functions
  const {
    writeContract: repayLoanICM,
    data: repayTxHash,
    isPending: isRepayPending,
  } = useScaffoldWriteContract("LoanManager");

  const { isLoading: isRepayConfirming, isSuccess: isRepaySuccess } = useWaitForTransactionReceipt({
    hash: repayTxHash,
  });

  // ICM Message Delivery Function
  const {
    writeContract: deliverMessage,
    data: deliverTxHash,
    isPending: isDeliverPending,
  } = useScaffoldWriteContract("MockTeleporterMessenger");

  const { isLoading: isDeliverConfirming, isSuccess: isDeliverSuccess } = useWaitForTransactionReceipt({
    hash: deliverTxHash,
  });

  // Read current nonce from TeleporterMessenger
  const { data: currentNonce } = useScaffoldReadContract({
    contractName: "MockTeleporterMessenger",
    functionName: "getCurrentNonce",
  });

  // Check message received status
  const { data: messageReceived } = useScaffoldReadContract({
    contractName: "MockTeleporterMessenger",
    functionName: "messageReceived",
    args: messageId ? [messageId as `0x${string}`] : [undefined],
  });

  // Efectos para manejar el flujo
  useEffect(() => {
    if (isRepaySuccess && repayTxHash && step === 1) {
      // Generar messageId simulado basado en el tx hash
      const simulatedMessageId = `0x${repayTxHash.slice(2, 66)}`;
      setMessageId(simulatedMessageId);
      setStep(2);
    }
  }, [isRepaySuccess, repayTxHash, step]);

  useEffect(() => {
    if (isDeliverSuccess && step === 2) {
      setStep(3);
    }
  }, [isDeliverSuccess, step]);

  // Test ICM message sending
  const handleRepayLoanWithICM = async () => {
    if (!tokenId || !paymentAmount || !interestAmount || !principalAmount) {
      alert("Por favor llena todos los campos");
      return;
    }

    try {
      setStep(1);
      await repayLoanICM({
        functionName: "repayLoan",
        args: [BigInt(tokenId), parseEther(paymentAmount), parseEther(interestAmount), parseEther(principalAmount)],
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Simulate message delivery (en producción esto lo haría un relayer automáticamente)
  const handleDeliverMessage = async () => {
    if (!messageId) {
      alert("No hay mensaje para entregar");
      return;
    }

    try {
      // Simular entrega del mensaje con parámetros de prueba
      const sourceBlockchainID = "0x" + "1".repeat(64); // Test blockchain ID
      const originSender = loanManagerContract?.address || connectedAddress;

      await deliverMessage({
        functionName: "deliverMessage",
        args: [messageId as `0x${string}`, sourceBlockchainID as `0x${string}`, originSender as `0x${string}`],
      });
    } catch (error) {
      console.error("Error delivering message:", error);
    }
  };

  // Reset flow
  const handleReset = () => {
    setStep(1);
    setMessageId("");
    setTokenId("");
    setPaymentAmount("");
    setInterestAmount("");
    setPrincipalAmount("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">🌐 ICM Testing Dashboard</h1>
        <p className="text-center text-lg text-gray-600">
          Prueba la integración de Avalanche ICM (Inter-Contract Messaging) para automatización de procesos
        </p>
      </div>

      {!connectedAddress && (
        <div className="alert alert-warning mb-6">
          <span>⚠️ Conecta tu wallet para probar ICM</span>
        </div>
      )}

      {/* ICM Flow Stepper */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">🔄 Flujo ICM: Demostración Paso a Paso</h2>

          <div className="steps w-full mb-6">
            <div className={`step ${step >= 1 ? "step-primary" : ""}`}>Preparar</div>
            <div className={`step ${step >= 2 ? "step-primary" : ""}`}>Mensaje Enviado</div>
            <div className={`step ${step >= 3 ? "step-primary" : ""}`}>Mensaje Entregado</div>
          </div>

          {step === 1 && (
            <div className="alert alert-info mb-4">
              <span>📝 **Paso 1**: Configura los datos del pago. Al enviar, LoanManager creará un mensaje ICM.</span>
            </div>
          )}

          {step === 2 && (
            <div className="alert alert-warning mb-4">
              <span>
                ⏳ **Paso 2**: Mensaje ICM enviado con ID: <code className="text-xs">{messageId?.slice(0, 10)}...</code>
                <br />
                En producción, un relayer automáticamente entregaría este mensaje.
                <br />
                Para la demo, simula la entrega manual.
              </span>
            </div>
          )}

          {step === 3 && (
            <div className="alert alert-success mb-4">
              <span>
                ✅ **Paso 3**: ¡Mensaje entregado! LendingPool procesó la distribución de intereses automáticamente.
                <br />
                Estado del mensaje: {messageReceived ? "✅ Recibido" : "❌ No recibido"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ICM Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg">📡 TeleporterMessenger</h2>
            <p className="text-sm text-gray-600">Mock ICM Messenger</p>
            <div className="text-xs">
              <span className="font-semibold">Address:</span>
              <br />
              <span className="font-mono">{teleporterContract?.address}</span>
            </div>
            <div className="text-xs mt-2">
              <span className="font-semibold">Current Nonce:</span> {currentNonce?.toString() || "0"}
            </div>
            <div className="badge badge-success mt-2">Activo</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg">💰 LoanManager</h2>
            <p className="text-sm text-gray-600">ICM Message Sender</p>
            <div className="text-xs">
              <span className="font-semibold">Address:</span>
              <br />
              <span className="font-mono">{loanManagerContract?.address}</span>
            </div>
            <div className="badge badge-primary mt-2">ICM Enabled</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg">🏦 LendingPool</h2>
            <p className="text-sm text-gray-600">ICM Message Receiver</p>
            <div className="text-xs">
              <span className="font-semibold">Address:</span>
              <br />
              <span className="font-mono">{lendingPoolContract?.address}</span>
            </div>
            <div className="badge badge-secondary mt-2">ICM Listener</div>
          </div>
        </div>
      </div>

      {/* ICM Flow Testing */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">🔄 Probar Flujo ICM: Pago de Préstamo → Distribución Automática</h2>

          <div className="alert alert-info mb-4">
            <span>
              ℹ️ Este flujo demuestra cómo ICM automatiza la distribución de intereses:
              <br />
              1. Usuario paga cuota del préstamo
              <br />
              2. LoanManager envía mensaje ICM a LendingPool
              <br />
              3. LendingPool procesa distribución automáticamente
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Token ID del NFT</span>
              </label>
              <input
                type="number"
                placeholder="ej: 1"
                className="input input-bordered"
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Monto Total de Pago (USDT)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="ej: 1000"
                className="input input-bordered"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Monto de Intereses (USDT)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="ej: 50"
                className="input input-bordered"
                value={interestAmount}
                onChange={e => setInterestAmount(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Monto de Principal (USDT)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="ej: 950"
                className="input input-bordered"
                value={principalAmount}
                onChange={e => setPrincipalAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {step === 1 && (
              <button
                className={`btn btn-primary btn-lg w-full ${isRepayPending || isRepayConfirming ? "loading" : ""}`}
                disabled={!connectedAddress || isRepayPending || isRepayConfirming}
                onClick={handleRepayLoanWithICM}
              >
                {isRepayPending
                  ? "Enviando Transacción..."
                  : isRepayConfirming
                    ? "Confirmando..."
                    : "🚀 Paso 1: Pagar Préstamo (Enviar Mensaje ICM)"}
              </button>
            )}

            {step === 2 && (
              <button
                className={`btn btn-warning btn-lg w-full ${isDeliverPending || isDeliverConfirming ? "loading" : ""}`}
                disabled={!messageId || isDeliverPending || isDeliverConfirming}
                onClick={handleDeliverMessage}
              >
                {isDeliverPending
                  ? "Entregando Mensaje..."
                  : isDeliverConfirming
                    ? "Confirmando Entrega..."
                    : "📦 Paso 2: Simular Entrega ICM (Relayer)"}
              </button>
            )}

            {step === 3 && (
              <button className="btn btn-accent btn-lg w-full" onClick={handleReset}>
                🔄 Reiniciar Demo ICM
              </button>
            )}
          </div>

          {isRepaySuccess && step === 2 && (
            <div className="alert alert-success mt-4">
              <span>
                ✅ ¡Mensaje ICM enviado! ID: <code className="text-xs">{messageId?.slice(0, 16)}...</code>
                <br />
                <span className="font-mono text-xs">Tx: {repayTxHash}</span>
                <br />
                💡 Ahora simula la entrega del mensaje (en producción esto sería automático)
              </span>
            </div>
          )}

          {isDeliverSuccess && step === 3 && (
            <div className="alert alert-success mt-4">
              <span>
                🎉 ¡Flujo ICM completado exitosamente!
                <br />
                📦 Mensaje entregado: <span className="font-mono text-xs">{deliverTxHash}</span>
                <br />
                💰 LendingPool procesó la distribución de intereses automáticamente
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Technical Flow Explanation */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">🔧 ¿Cómo Funciona ICM en Esta Demo?</h2>

          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold mb-2">📤 Paso 1: Envío del Mensaje</h3>
              <p className="text-sm">
                Cuando pagas el préstamo, <code>LoanManager.repayLoan()</code> llama a
                <code>teleporterMessenger.sendCrossChainMessage()</code> con:
              </p>
              <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
                <li>
                  <strong>Destino:</strong> Dirección del LendingPool
                </li>
                <li>
                  <strong>Mensaje:</strong> Datos codificados de distribución de intereses
                </li>
                <li>
                  <strong>Blockchain ID:</strong> ID de la subnet destino
                </li>
              </ul>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🚀 Paso 2: Entrega del Mensaje (Relayer)</h3>
              <p className="text-sm">
                En producción, un <strong>relayer</strong> automáticamente:
              </p>
              <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
                <li>Detecta el mensaje ICM en la blockchain origen</li>
                <li>
                  Llama a <code>deliverMessage()</code> en la blockchain destino
                </li>
                <li>Recibe incentivos por el servicio</li>
              </ul>
              <p className="text-xs mt-2 italic">
                💡 En esta demo, simulamos el relayer manualmente para propósitos educativos.
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-bold mb-2">📥 Paso 3: Procesamiento Automático</h3>
              <p className="text-sm">
                <code>LendingPool.receiveTeleporterMessage()</code> se ejecuta automáticamente:
              </p>
              <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
                <li>Decodifica los datos de distribución de intereses</li>
                <li>Procesa la distribución a inversores</li>
                <li>Actualiza balances y estados</li>
                <li>Todo sin intervención manual</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm">
              <strong>🏆 Resultado:</strong> Automatización completa del proceso de distribución de intereses usando la
              tecnología ICM de Avalanche, eliminando la necesidad de intervención manual y creando un sistema
              verdaderamente descentralizado.
            </p>
          </div>
        </div>
      </div>

      {/* ICM Benefits Explanation */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">🎯 Beneficios de la Integración ICM</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">🏗️ Arquitectura Avanzada</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Separación clara de responsabilidades</li>
                <li>Comunicación asíncrona entre contratos</li>
                <li>Escalabilidad para múltiples subnets</li>
                <li>Tolerancia a fallas mejorada</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">⚡ Automatización</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Distribución automática de intereses</li>
                <li>Procesos descentralizados sin intervención manual</li>
                <li>Incentivos para relayers</li>
                <li>Retry automático en caso de fallas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">🔒 Seguridad</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Replay protection integrada</li>
                <li>Verificación criptográfica de mensajes</li>
                <li>Control de acceso granular</li>
                <li>Validación de origen de mensajes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">💡 Innovación</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Integración con bounty de Avalanche</li>
                <li>Uso de tecnología cutting-edge</li>
                <li>Preparado para multi-chain</li>
                <li>Ejemplo de arquitectura profesional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
