const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuditPay", function () {
  let AuditPay, auditPay, MockUSDT, mockUSDT;
  let owner, user1, user2;
  const ethFee = ethers.utils.parseEther("0.01");
  const usdtFee = ethers.utils.parseUnits("500", 6);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock USDT
    MockUSDT = await ethers.getContractFactory("MockERC20");
    mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await mockUSDT.deployed();

    // Deploy AuditPay
    AuditPay = await ethers.getContractFactory("AuditPay");
    auditPay = await AuditPay.deploy(mockUSDT.address);
    await auditPay.deployed();

    // Mint USDT to users
    await mockUSDT.mint(user1.address, ethers.utils.parseUnits("1000", 6));
    await mockUSDT.mint(user2.address, ethers.utils.parseUnits("1000", 6));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await auditPay.owner()).to.equal(owner.address);
    });

    it("Should set correct initial fees", async function () {
      expect(await auditPay.ethFee()).to.equal(ethFee);
      expect(await auditPay.usdtFee()).to.equal(usdtFee);
    });

    it("Should set USDT address", async function () {
      expect(await auditPay.USDT()).to.equal(mockUSDT.address);
    });
  });

  describe("ETH Payments", function () {
    const contractAddress = "0x1234567890123456789012345678901234567890";

    it("Should accept ETH payment for audit", async function () {
      await expect(
        auditPay.connect(user1).payForAuditETH(contractAddress, {
          value: ethFee
        })
      ).to.emit(auditPay, "AuditPaid")
        .withArgs(user1.address, contractAddress, ethFee, true, await getBlockTimestamp());

      expect(await auditPay.hasPaidForAudit(user1.address, contractAddress)).to.be.true;
      expect(await auditPay.userAuditCount(user1.address)).to.equal(1);
    });

    it("Should reject insufficient ETH payment", async function () {
      await expect(
        auditPay.connect(user1).payForAuditETH(contractAddress, {
          value: ethers.utils.parseEther("0.005")
        })
      ).to.be.revertedWithCustomError(auditPay, "InsufficientPayment");
    });

    it("Should reject duplicate payments", async function () {
      await auditPay.connect(user1).payForAuditETH(contractAddress, {
        value: ethFee
      });

      await expect(
        auditPay.connect(user1).payForAuditETH(contractAddress, {
          value: ethFee
        })
      ).to.be.revertedWithCustomError(auditPay, "AlreadyPaid");
    });

    it("Should refund excess ETH", async function () {
      const excessAmount = ethers.utils.parseEther("0.02");
      const initialBalance = await user1.getBalance();

      const tx = await auditPay.connect(user1).payForAuditETH(contractAddress, {
        value: excessAmount
      });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const finalBalance = await user1.getBalance();
      const expectedBalance = initialBalance.sub(ethFee).sub(gasUsed);

      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.utils.parseEther("0.001"));
    });
  });

  describe("USDT Payments", function () {
    const contractAddress = "0x1234567890123456789012345678901234567890";

    it("Should accept USDT payment for audit", async function () {
      await mockUSDT.connect(user1).approve(auditPay.address, usdtFee);

      await expect(
        auditPay.connect(user1).payForAuditUSDT(contractAddress)
      ).to.emit(auditPay, "AuditPaid")
        .withArgs(user1.address, contractAddress, usdtFee, false, await getBlockTimestamp());

      expect(await auditPay.hasPaidForAudit(user1.address, contractAddress)).to.be.true;
      expect(await mockUSDT.balanceOf(auditPay.address)).to.equal(usdtFee);
    });

    it("Should reject USDT payment without approval", async function () {
      await expect(
        auditPay.connect(user1).payForAuditUSDT(contractAddress)
      ).to.be.revertedWithCustomError(auditPay, "TransferFailed");
    });

    it("Should reject insufficient USDT balance", async function () {
      await mockUSDT.connect(user1).transfer(user2.address, ethers.utils.parseUnits("600", 6));
      await mockUSDT.connect(user1).approve(auditPay.address, usdtFee);

      await expect(
        auditPay.connect(user1).payForAuditUSDT(contractAddress)
      ).to.be.revertedWithCustomError(auditPay, "InsufficientBalance");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update fees", async function () {
      const newEthFee = ethers.utils.parseEther("0.02");
      const newUsdtFee = ethers.utils.parseUnits("1000", 6);

      await expect(
        auditPay.updateFees(newEthFee, newUsdtFee)
      ).to.emit(auditPay, "FeeUpdated")
        .withArgs(newEthFee, newUsdtFee);

      expect(await auditPay.ethFee()).to.equal(newEthFee);
      expect(await auditPay.usdtFee()).to.equal(newUsdtFee);
    });

    it("Should reject fee updates from non-owner", async function () {
      await expect(
        auditPay.connect(user1).updateFees(ethers.utils.parseEther("0.02"), ethers.utils.parseUnits("1000", 6))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw ETH", async function () {
      const contractAddress = "0x1234567890123456789012345678901234567890";
      await auditPay.connect(user1).payForAuditETH(contractAddress, { value: ethFee });

      const initialBalance = await owner.getBalance();
      const tx = await auditPay.withdrawETH();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const finalBalance = await owner.getBalance();
      expect(finalBalance).to.equal(initialBalance.add(ethFee).sub(gasUsed));
    });

    it("Should allow owner to withdraw USDT", async function () {
      const contractAddress = "0x1234567890123456789012345678901234567890";
      await mockUSDT.connect(user1).approve(auditPay.address, usdtFee);
      await auditPay.connect(user1).payForAuditUSDT(contractAddress);

      await auditPay.withdrawUSDT();
      expect(await mockUSDT.balanceOf(owner.address)).to.equal(usdtFee);
    });
  });

  describe("Statistics", function () {
    it("Should track contract statistics", async function () {
      const contractAddress1 = "0x1234567890123456789012345678901234567890";
      const contractAddress2 = "0x0987654321098765432109876543210987654321";

      await auditPay.connect(user1).payForAuditETH(contractAddress1, { value: ethFee });
      await mockUSDT.connect(user2).approve(auditPay.address, usdtFee);
      await auditPay.connect(user2).payForAuditUSDT(contractAddress2);

      const stats = await auditPay.getStats();
      expect(stats._totalAudits).to.equal(2);
      expect(stats._totalEthCollected).to.equal(ethFee);
      expect(stats._totalUsdtCollected).to.equal(usdtFee);
    });

    it("Should track user statistics", async function () {
      const contractAddress1 = "0x1234567890123456789012345678901234567890";
      const contractAddress2 = "0x0987654321098765432109876543210987654321";

      await auditPay.connect(user1).payForAuditETH(contractAddress1, { value: ethFee });
      await mockUSDT.connect(user1).approve(auditPay.address, usdtFee);
      await auditPay.connect(user1).payForAuditUSDT(contractAddress2);

      expect(await auditPay.getUserStats(user1.address)).to.equal(2);
    });
  });

  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});