const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Splitable Testing', async () => {
  let splitable;
  let nounsTokenMock;
  let nounsDAOLogicMock;
  let owner;
  let nonOwner;

  before(async () => {
    [owner, nonOwner] = await ethers.getSigners();

    // deploy NounsTokenMock
    const NounsTokenMock = await ethers.getContractFactory('NounsTokenMock');
    nounsTokenMock = await NounsTokenMock.deploy();

    // deploy NounsDAOLogicMock
    const NounsDAOLogicMock = await ethers.getContractFactory('NounsDAOLogicMock');
    nounsDAOLogicMock = await NounsDAOLogicMock.deploy();

    const Splitable = await ethers.getContractFactory('Splitable');
    splitable = await Splitable.deploy(nounsDAOLogicMock.address, nounsTokenMock.address);
  });

  describe('Deployment', async () => {
    it('should deployed', async function () {
      expect(nounsTokenMock.address).to.not.equal('');
      expect(nounsDAOLogicMock.address).to.not.equal('');
      expect(splitable.address).to.not.equal('');
    });
  });

  describe('Testing Deposit, Withdraw & Delegate', async () => {
    before(async () => {
      await nounsTokenMock.mint();
      await nounsTokenMock.mint();
    });

    it('should deposit', async () => {
      await nounsTokenMock.setApprovalForAll(splitable.address, true);

      await splitable.deposit([0, 1]);

      expect(await nounsTokenMock.balanceOf(owner.address)).to.eq(ethers.BigNumber.from('0'));
      expect(await nounsTokenMock.balanceOf(splitable.address)).to.eq(ethers.BigNumber.from('2'));
    });

    it('should delegate', async () => {
      expect(await nounsTokenMock.delegates(nonOwner.address)).to.eq(nonOwner.address);
    });

    it('should withdraw', async () => {
      await splitable.withdraw();

      expect(await nounsTokenMock.balanceOf(owner.address)).to.eq(ethers.BigNumber.from('2'));
      expect(await nounsTokenMock.balanceOf(splitable.address)).to.eq(ethers.BigNumber.from('0'));
    });
  });

  describe('Testing DAO Function', async () => {
    before(async () => {
      await splitable.deposit([0, 1]);
    });

    it('should vote', async () => {
      expect(await splitable.castVote(1, 0)).not.to.be.reverted;
    });

    it('should vote with reason', async () => {
      expect(await splitable.castVoteWithReason(1, 0, 'reason')).not.to.be.reverted;
    });

    it('should propose', async () => {
      function encodeParameters(types, values) {
        const abi = new ethers.utils.AbiCoder();
        return abi.encode(types, values);
      }
      const targets = [owner.address];
      const values = ['0'];
      const signatures = ['getBalanceOf(address)'];
      const callDatas = [encodeParameters(['address'], [owner.address])];

      expect(await splitable.propose(targets, values, signatures, callDatas, 'do nothing')).not.to
        .be.reverted;
    });
  });
});
