import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { LendingPool, MockUSDT, RealEstateNFT, LoanManager } from "../typechain-types";

describe("Real Estate Lending Platform", function () {
  let deployer: SignerWithAddress;
  let investor: SignerWithAddress;
  let borrower: SignerWithAddress;

  let mockUSDT: MockUSDT;
  let realEstateNFT: RealEstateNFT;
  let lendingPool: LendingPool;
  let loanManager: LoanManager;

  const INVESTOR_DEPOSIT = ethers.parseUnits("10000", 6); // 10,000 USDT
  const LOAN_AMOUNT = ethers.parseUnits("5000", 6); // 5,000 USDT
  const PROPERTY_VALUE = ethers.parseUnits("10000", 6); // $10,000 property

  beforeEach(async function () {
    [deployer, investor, borrower] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDTFactory = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDTFactory.deploy();

    // Deploy RealEstateNFT
    const RealEstateNFTFactory = await ethers.getContractFactory("RealEstateNFT");
    realEstateNFT = await RealEstateNFTFactory.deploy(deployer.address);

    // Deploy LendingPool
    const LendingPoolFactory = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPoolFactory.deploy(deployer.address, await mockUSDT.getAddress());

    // Deploy LoanManager
    const LoanManagerFactory = await ethers.getContractFactory("LoanManager");
    loanManager = await LoanManagerFactory.deploy(
      deployer.address,
      await realEstateNFT.getAddress(),
      await lendingPool.getAddress(),
      await mockUSDT.getAddress()
    );

    // Set LoanManager in LendingPool
    await lendingPool.setLoanManagerContract(await loanManager.getAddress());

    // Mint USDT to investor
    await mockUSDT.mint(investor.address, INVESTOR_DEPOSIT);
  });

  describe("LendingPool", function () {
    it("Should allow investors to deposit USDT", async function () {
      // Investor approves and deposits
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);
      await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);

      const [principal] = await lendingPool.getLenderInfo(investor.address);
      expect(principal).to.equal(INVESTOR_DEPOSIT);

      const [totalSupplied] = await lendingPool.getPoolStats();
      expect(totalSupplied).to.equal(INVESTOR_DEPOSIT);
    });

    it("Should show available liquidity", async function () {
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);
      await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);

      expect(await lendingPool.getAvailableLiquidity()).to.equal(INVESTOR_DEPOSIT);
    });

    it("Should allow withdrawals", async function () {
      // Backend calculates that investor can withdraw based on actual calculations
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);
      await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);

      // For this test, we'll withdraw partial amount to avoid edge cases
      const withdrawAmount = ethers.parseUnits("5000", 6); // 5,000 USDT
      await lendingPool.connect(investor).withdraw(withdrawAmount);

      expect(await mockUSDT.balanceOf(investor.address)).to.equal(withdrawAmount);
    });
  });

  describe("LoanManager", function () {
    beforeEach(async function () {
      // Setup: investor deposits, borrower has property
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);
      await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);

      // Mint property NFT to borrower
      await realEstateNFT.mintProperty(borrower.address, "QmTestPropertyHash", PROPERTY_VALUE);
    });

    it("Should create a loan with NFT collateral", async function () {
      const tokenId = 1;

      // Borrower approves NFT transfer
      await realEstateNFT.connect(borrower).approve(await loanManager.getAddress(), tokenId);

      // Backend already calculated loan eligibility and amount
      await loanManager.connect(borrower).createLoan(tokenId, LOAN_AMOUNT);

      // Check loan was created
      const loan = await loanManager.loans(1);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.principalAmount).to.equal(LOAN_AMOUNT);
      expect(loan.tokenId).to.equal(tokenId);

      // Check NFT is in custody
      expect(await realEstateNFT.ownerOf(tokenId)).to.equal(await loanManager.getAddress());

      // Check borrower received funds
      expect(await mockUSDT.balanceOf(borrower.address)).to.equal(LOAN_AMOUNT);
    });

    it("Should allow loan repayments", async function () {
      const tokenId = 1;

      // Create loan
      await realEstateNFT.connect(borrower).approve(await loanManager.getAddress(), tokenId);
      await loanManager.connect(borrower).createLoan(tokenId, LOAN_AMOUNT);

      // Backend calculates payment amount (principal + interest)
      const paymentAmount = ethers.parseUnits("5425", 6); // 5000 + 425 interest

      // Mint USDT for borrower to make payment
      await mockUSDT.mint(borrower.address, paymentAmount);

      // Borrower makes payment
      await mockUSDT.connect(borrower).approve(await loanManager.getAddress(), paymentAmount);
      await loanManager.connect(borrower).repayLoan(1, paymentAmount);

      // Check payment was recorded
      const loan = await loanManager.loans(1);
      expect(loan.totalRepaid).to.equal(paymentAmount);
    });

    it("Should complete loan and return NFT", async function () {
      const tokenId = 1;

      // Create loan
      await realEstateNFT.connect(borrower).approve(await loanManager.getAddress(), tokenId);
      await loanManager.connect(borrower).createLoan(tokenId, LOAN_AMOUNT);

      // Backend determines loan is fully paid and calls completeLoan
      await loanManager.completeLoan(1);

      // Check loan status
      const loan = await loanManager.loans(1);
      expect(loan.status).to.equal(1); // LoanStatus.Repaid

      // Check NFT returned to borrower
      expect(await realEstateNFT.ownerOf(tokenId)).to.equal(borrower.address);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use minimal gas for basic operations", async function () {
      // Test that simplified contracts use significantly less gas
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);

      const tx = await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);
      const receipt = await tx.wait();

      console.log("📊 Gas used for deposit:", receipt?.gasUsed.toString());

      // Simplified contract should use less than 200k gas for deposit
      expect(Number(receipt?.gasUsed)).to.be.lessThan(200000);
    });
  });

  describe("Integration Test", function () {
    it("Should complete a minimal loan cycle", async function () {
      console.log("🏦 Starting minimal loan cycle test...");

      const tokenId = 1;

      // 1. Investor deposits
      await mockUSDT.connect(investor).approve(await lendingPool.getAddress(), INVESTOR_DEPOSIT);
      await lendingPool.connect(investor).deposit(INVESTOR_DEPOSIT);
      console.log("✅ Investor deposited");

      // 2. Mint property
      await realEstateNFT.mintProperty(borrower.address, "QmTestPropertyHash", PROPERTY_VALUE);
      console.log("✅ Property minted");

      // 3. Create loan
      await realEstateNFT.connect(borrower).approve(await loanManager.getAddress(), tokenId);
      await loanManager.connect(borrower).createLoan(tokenId, LOAN_AMOUNT);
      console.log("✅ Loan created");

      // 4. Repay loan (backend calculated amount)
      const totalPayment = ethers.parseUnits("5425", 6);
      await mockUSDT.mint(borrower.address, ethers.parseUnits("425", 6)); // Additional for interest
      await mockUSDT.connect(borrower).approve(await loanManager.getAddress(), totalPayment);
      await loanManager.connect(borrower).repayLoan(1, totalPayment);
      console.log("✅ Loan repaid");

      // 5. Complete loan
      await loanManager.completeLoan(1);
      console.log("✅ Loan completed");

      // Verify final state
      expect(await realEstateNFT.ownerOf(tokenId)).to.equal(borrower.address);

      const loan = await loanManager.loans(1);
      expect(loan.status).to.equal(1); // Repaid

      console.log("🎉 Minimal loan cycle completed successfully!");
    });
  });
});
