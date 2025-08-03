/**
 * EJEMPLOS DE CÁLCULOS QUE DEBEN HACERSE EN EL FRONTEND (OFF-CHAIN)
 *
 * Estos cálculos fueron removidos de los smart contracts para optimizar gas
 * y permitir mayor flexibilidad en futuras actualizaciones.
 */

// 📊 ESTADÍSTICAS DEL SISTEMA
async function getSystemStats(loanManager, realEstateNFT) {
  const totalProperties = await realEstateNFT.getTotalProperties();
  const totalLoans = await loanManager.getTotalLoans();

  let activeLoans = 0;
  let totalLent = 0n;
  let defaultedLoans = 0;
  let repaidLoans = 0;

  // Iterar por todos los préstamos
  for (let i = 1; i <= totalLoans; i++) {
    const loanInfo = await loanManager.getLoanInfo(i);
    const [, , principalAmount, , , , , , status] = loanInfo;

    if (status === 0n) {
      // Active
      activeLoans++;
      totalLent += principalAmount;

      const isInDefault = await loanManager.isLoanInDefault(i);
      if (isInDefault) {
        defaultedLoans++;
      }
    } else if (status === 1n) {
      // Repaid
      repaidLoans++;
    }
  }

  return {
    totalProperties: Number(totalProperties),
    totalLoans: Number(totalLoans),
    activeLoans,
    totalLent: totalLent.toString(),
    defaultedLoans,
    repaidLoans,
  };
}

// 🏠 ESTADÍSTICAS DE PROPIEDADES
async function getPropertyStats(realEstateNFT) {
  const totalProperties = await realEstateNFT.getTotalProperties();
  let available = 0;
  let collateralized = 0;
  let inAuction = 0;
  let totalValue = 0n;

  for (let i = 1; i <= totalProperties; i++) {
    try {
      const [, status, valuation] = await realEstateNFT.getPropertyInfo(i);
      totalValue += valuation;

      if (status === 0n) available++;
      else if (status === 1n) collateralized++;
      else if (status === 2n) inAuction++;
    } catch (error) {
      console.error(`Error fetching property ${i}:`, error);
      continue;
    }
  }

  return {
    total: Number(totalProperties),
    available,
    collateralized,
    inAuction,
    totalValue: totalValue.toString(),
  };
}

// 🔥 SUBASTAS ACTIVAS (reemplaza getActiveAuctions del contrato)
async function getActiveAuctions(auctionContract) {
  const totalAuctions = await auctionContract.getTotalAuctions();
  const activeAuctions = [];

  for (let i = 1; i <= totalAuctions; i++) {
    try {
      const auctionInfo = await auctionContract.getAuctionInfo(i);
      const status = auctionInfo[10]; // Status is at index 10

      if (status === 0n) {
        // Active
        activeAuctions.push({
          auctionId: i,
          tokenId: Number(auctionInfo[0]),
          loanId: Number(auctionInfo[1]),
          originalBorrower: auctionInfo[2],
          debtAmount: auctionInfo[3].toString(),
          startingPrice: auctionInfo[4].toString(),
          reservePrice: auctionInfo[5].toString(),
          currentBid: auctionInfo[6].toString(),
          currentBidder: auctionInfo[7],
          startTime: Number(auctionInfo[8]),
          endTime: Number(auctionInfo[9]),
        });
      }
    } catch (error) {
      console.error(`Error fetching auction ${i}:`, error);
      continue;
    }
  }

  return activeAuctions;
}

// 💰 CÁLCULOS FINANCIEROS ÚTILES
function calculateAPR(principalAmount, interestRate) {
  // interestRate está en puntos básicos (800 = 8%)
  return (interestRate / 100).toFixed(2) + "%";
}

function calculateMonthlyPayment(principalAmount, annualRate, durationInDays) {
  const monthlyRate = annualRate / 10000 / 12;
  const numberOfPayments = durationInDays / 30.44; // Promedio días por mes

  if (monthlyRate === 0) return principalAmount / numberOfPayments;

  const monthlyPayment =
    (principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return monthlyPayment;
}

function formatCurrency(amount, decimals = 6) {
  // Para USDT que tiene 6 decimales
  const value = Number(amount) / Math.pow(10, decimals);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function calculateTimeRemaining(endTime) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;

  if (remaining <= 0) return "Finalizado";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// 📈 CONFIGURACIÓN DINÁMICA
const DEFAULT_CONFIG = {
  loanToValueRatio: 5000, // 50%
  borrowerInterestRate: 800, // 8%
  defaultLoanDuration: 365 * 24 * 60 * 60, // 1 año en segundos
  gracePeriod: 30 * 24 * 60 * 60, // 30 días en segundos

  // Configuración de subastas
  defaultAuctionDuration: 7 * 24 * 60 * 60, // 7 días
  minimumBidIncrement: 100, // 1%
  reservePriceRatio: 7000, // 70%
};

// Funciones para actualizar configuración desde el frontend
async function updateSystemConfig(loanManager, newConfig, signer) {
  // Solo el owner puede actualizar
  if (newConfig.loanToValueRatio) {
    await loanManager.connect(signer).updateLoanToValueRatio(newConfig.loanToValueRatio);
  }

  if (newConfig.borrowerInterestRate) {
    await loanManager.connect(signer).updateInterestRate(newConfig.borrowerInterestRate);
  }

  if (newConfig.gracePeriod) {
    await loanManager.connect(signer).updateGracePeriod(newConfig.gracePeriod);
  }
}

module.exports = {
  getSystemStats,
  getPropertyStats,
  getActiveAuctions,
  calculateAPR,
  calculateMonthlyPayment,
  formatCurrency,
  calculateTimeRemaining,
  updateSystemConfig,
  DEFAULT_CONFIG,
};
