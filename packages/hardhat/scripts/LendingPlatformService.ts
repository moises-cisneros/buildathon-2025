import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";

/**
 * Servicio off-chain para cálculos complejos del Real Estate Lending Platform
 * Maneja validaciones, cálculos de intereses y genera signatures para transacciones
 */
export class LendingPlatformService {
  private provider: ethers.JsonRpcProvider;
  private signerWallet: ethers.Wallet;
  private contracts: {
    lendingPool: ethers.Contract;
    loanManager: ethers.Contract;
    realEstateNFT: ethers.Contract;
  };

  constructor(
    rpcUrl: string,
    privateKey: string,
    contractAddresses: {
      lendingPool: string;
      loanManager: string;
      realEstateNFT: string;
    },
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signerWallet = new ethers.Wallet(privateKey, this.provider);
    // Initialize contracts...
  }

  // =============================================
  // CÁLCULOS DE INTERESES
  // =============================================

  /**
   * Calcula intereses acumulados para un usuario específico
   */
  async calculateUserInterest(userAddress: string): Promise<{
    principal: BigNumber;
    accruedInterest: BigNumber;
    totalBalance: BigNumber;
    lastUpdate: number;
  }> {
    const userInfo = await this.contracts.lendingPool.getUserInfo(userAddress);
    const currentTime = Math.floor(Date.now() / 1000);

    const principal = new BigNumber(userInfo.balance.toString());
    const lastUpdate = userInfo.lastUpdate.toNumber();
    const interestRate = new BigNumber("0.06"); // 6% APY

    const timeElapsed = currentTime - lastUpdate;
    const annualizedTime = new BigNumber(timeElapsed).div(365 * 24 * 60 * 60);

    const accruedInterest = principal.multipliedBy(interestRate).multipliedBy(annualizedTime);
    const totalBalance = principal.plus(accruedInterest);

    return {
      principal,
      accruedInterest,
      totalBalance,
      lastUpdate,
    };
  }

  /**
   * Calcula intereses para todos los usuarios
   */
  async calculateAllUsersInterest(): Promise<Map<string, any>> {
    // Implementar lógica para obtener todos los usuarios
    // y calcular sus intereses en batch
    const results = new Map();
    // ... lógica de cálculo en batch
    return results;
  }

  // =============================================
  // VALIDACIONES DE PRÉSTAMOS
  // =============================================

  /**
   * Valida eligibilidad para préstamo
   */
  async validateLoanEligibility(
    borrowerAddress: string,
    tokenId: string,
    requestedAmount: BigNumber,
  ): Promise<{
    isEligible: boolean;
    maxLoanAmount: BigNumber;
    ltvRatio: BigNumber;
    propertyValue: BigNumber;
    riskScore: number;
    reasons: string[];
  }> {
    const reasons: string[] = [];

    // 1. Verificar propiedad del NFT
    const owner = await this.contracts.realEstateNFT.ownerOf(tokenId);
    if (owner.toLowerCase() !== borrowerAddress.toLowerCase()) {
      reasons.push("No es propietario del NFT");
      return {
        isEligible: false,
        maxLoanAmount: new BigNumber(0),
        ltvRatio: new BigNumber(0),
        propertyValue: new BigNumber(0),
        riskScore: 0,
        reasons,
      };
    }

    // 2. Obtener valor de la propiedad
    const propertyInfo = await this.contracts.realEstateNFT.getPropertyInfo(tokenId);
    const propertyValue = new BigNumber(propertyInfo.valuation.toString());

    // 3. Calcular LTV permitido (65% por defecto, pero puede ser dinámico)
    const ltvRatio = await this.calculateDynamicLTV(tokenId, borrowerAddress);
    const maxLoanAmount = propertyValue.multipliedBy(ltvRatio);

    // 4. Verificar si el monto solicitado está dentro del límite
    if (requestedAmount.isGreaterThan(maxLoanAmount)) {
      reasons.push(`Monto excede LTV máximo permitido (${ltvRatio.multipliedBy(100)}%)`);
    }

    // 5. Verificar liquidez del pool
    const availableLiquidity = await this.contracts.lendingPool.getAvailableLiquidity();
    if (requestedAmount.isGreaterThan(new BigNumber(availableLiquidity.toString()))) {
      reasons.push("Liquidez insuficiente en el pool");
    }

    // 6. Análisis de riesgo del prestatario
    const riskScore = await this.calculateBorrowerRiskScore(borrowerAddress);
    if (riskScore > 70) {
      // Umbral de riesgo alto
      reasons.push("Perfil de riesgo demasiado alto");
    }

    const isEligible = reasons.length === 0;

    return {
      isEligible,
      maxLoanAmount,
      ltvRatio,
      propertyValue,
      riskScore,
      reasons,
    };
  }

  /**
   * Calcula LTV dinámico basado en factores de riesgo
   */
  private async calculateDynamicLTV(tokenId: string, borrowerAddress: string): Promise<BigNumber> {
    // LTV base
    let ltv = new BigNumber("0.65"); // 65%

    // Factores que pueden reducir LTV:
    // - Ubicación de la propiedad
    // - Historial crediticio del prestatario
    // - Condiciones del mercado
    // - Tipo de propiedad

    // Ejemplo de ajustes dinámicos:
    const propertyInfo = await this.contracts.realEstateNFT.getPropertyInfo(tokenId);
    const location = propertyInfo.location;

    // Ajuste por ubicación (esto sería más sofisticado en producción)
    if (location.includes("high-risk-zone")) {
      ltv = ltv.multipliedBy(0.9); // Reducir LTV en 10%
    }

    // Ajuste por historial del prestatario
    const borrowerHistory = await this.getBorrowerHistory(borrowerAddress);
    if (borrowerHistory.defaultCount > 0) {
      ltv = ltv.multipliedBy(0.8); // Reducir LTV en 20%
    }

    return ltv;
  }

  /**
   * Calcula score de riesgo del prestatario
   */
  private async calculateBorrowerRiskScore(borrowerAddress: string): Promise<number> {
    // Implementar lógica de scoring basada en:
    // - Historial de préstamos
    // - Comportamiento de pago
    // - Diversificación de activos
    // - Análisis on-chain de la wallet

    let riskScore = 50; // Score base (0-100, donde 100 es máximo riesgo)

    const borrowerHistory = await this.getBorrowerHistory(borrowerAddress);

    // Ajustar por historial de defaults
    riskScore += borrowerHistory.defaultCount * 20;

    // Ajustar por número de préstamos exitosos
    riskScore -= Math.min(borrowerHistory.successfulLoans * 5, 25);

    return Math.max(0, Math.min(100, riskScore));
  }

  // =============================================
  // CÁLCULOS DE PRÉSTAMOS
  // =============================================

  /**
   * Calcula pago de préstamo con intereses
   */
  async calculateLoanPayment(
    loanId: string,
    paymentAmount?: BigNumber,
  ): Promise<{
    totalDebt: BigNumber;
    principal: BigNumber;
    accruedInterest: BigNumber;
    platformFee: BigNumber;
    paymentBreakdown: {
      toPrincipal: BigNumber;
      toInterest: BigNumber;
      toPlatform: BigNumber;
    };
  }> {
    const loan = await this.contracts.loanManager.getLoanInfo(loanId);
    const currentTime = Math.floor(Date.now() / 1000);

    const principal = new BigNumber(loan.principalAmount.toString());
    const startTime = loan.startTime.toNumber();
    const interestRate = new BigNumber("0.085"); // 8.5% APY para prestatarios

    // Calcular interés acumulado
    const timeElapsed = currentTime - startTime;
    const annualizedTime = new BigNumber(timeElapsed).div(365 * 24 * 60 * 60);
    const accruedInterest = principal.multipliedBy(interestRate).multipliedBy(annualizedTime);

    // Calcular comisión de plataforma (15% de los intereses)
    const platformFee = accruedInterest.multipliedBy(0.15);

    const totalDebt = principal.plus(accruedInterest).plus(platformFee);

    // Si no se especifica monto, asumir pago total
    const actualPayment = paymentAmount || totalDebt;

    // Distribuir pago: primero intereses, luego principal
    let remainingPayment = actualPayment;
    const toPlatform = BigNumber.minimum(remainingPayment, platformFee);
    remainingPayment = remainingPayment.minus(toPlatform);

    const toInterest = BigNumber.minimum(remainingPayment, accruedInterest);
    remainingPayment = remainingPayment.minus(toInterest);

    const toPrincipal = BigNumber.minimum(remainingPayment, principal);

    return {
      totalDebt,
      principal,
      accruedInterest,
      platformFee,
      paymentBreakdown: {
        toPrincipal,
        toInterest,
        toPlatform,
      },
    };
  }

  // =============================================
  // GENERACIÓN DE SIGNATURES
  // =============================================

  /**
   * Genera signature para retiro con intereses calculados
   */
  async generateWithdrawalSignature(
    userAddress: string,
    principal: BigNumber,
    interest: BigNumber,
    nonce: number,
  ): Promise<string> {
    const chainId = await this.provider.getNetwork().then(n => n.chainId);

    const hash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      [userAddress, principal.toString(), interest.toString(), nonce, chainId],
    );

    return await this.signerWallet.signMessage(ethers.getBytes(hash));
  }

  /**
   * Genera signature para autorización de préstamo
   */
  async generateLoanApprovalSignature(
    borrowerAddress: string,
    tokenId: string,
    amount: BigNumber,
    nonce: number,
  ): Promise<string> {
    const chainId = await this.provider.getNetwork().then(n => n.chainId);

    const hash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      [borrowerAddress, tokenId, amount.toString(), nonce, chainId],
    );

    return await this.signerWallet.signMessage(ethers.getBytes(hash));
  }

  /**
   * Genera signature para pago de préstamo
   */
  async generateRepaymentSignature(
    borrowerAddress: string,
    loanId: string,
    principal: BigNumber,
    interest: BigNumber,
    platformFee: BigNumber,
    nonce: number,
  ): Promise<string> {
    const chainId = await this.provider.getNetwork().then(n => n.chainId);

    const hash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
      [borrowerAddress, loanId, principal.toString(), interest.toString(), platformFee.toString(), nonce, chainId],
    );

    return await this.signerWallet.signMessage(ethers.getBytes(hash));
  }

  // =============================================
  // FUNCIONES AUXILIARES
  // =============================================

  private async getBorrowerHistory(borrowerAddress: string): Promise<{
    totalLoans: number;
    successfulLoans: number;
    defaultCount: number;
    averagePaymentTime: number;
  }> {
    // Implementar consulta del historial del prestatario
    // Esto podría venir de una base de datos off-chain o análisis on-chain
    return {
      totalLoans: 0,
      successfulLoans: 0,
      defaultCount: 0,
      averagePaymentTime: 0,
    };
  }

  /**
   * Obtiene métricas en tiempo real del protocolo
   */
  async getProtocolMetrics(): Promise<{
    totalValueLocked: BigNumber;
    totalLoansOutstanding: BigNumber;
    averageInterestRate: BigNumber;
    liquidityUtilization: BigNumber;
    defaultRate: BigNumber;
  }> {
    // Implementar cálculo de métricas agregadas
    const poolStats = await this.contracts.lendingPool.getPoolStats();

    return {
      totalValueLocked: new BigNumber(poolStats._totalSupplied.toString()),
      totalLoansOutstanding: new BigNumber(poolStats._totalLent.toString()),
      averageInterestRate: new BigNumber("0.06"),
      liquidityUtilization: new BigNumber(poolStats._totalLent.toString()).div(
        new BigNumber(poolStats._totalSupplied.toString()),
      ),
      defaultRate: new BigNumber("0.02"), // 2% default rate ejemplo
    };
  }
}
