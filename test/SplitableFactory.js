const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Splitable Factory Testing', async () => {
  let splitableFactory;

  before(async () => {
    [owner, nonOwner] = await ethers.getSigners();

    // deploy NounsTokenMock
    const NounsTokenMock = await ethers.getContractFactory('NounsTokenMock');
    const nounsTokenMock = await NounsTokenMock.deploy();

    // deploy NounsDAOLogicMock
    const NounsDAOLogicMock = await ethers.getContractFactory('NounsDAOLogicMock');
    const nounsDAOLogicMock = await NounsDAOLogicMock.deploy();

    const SplitableFactory = await ethers.getContractFactory('SplitableFactory');
    splitableFactory = await SplitableFactory.deploy(
      nounsDAOLogicMock.address,
      nounsTokenMock.address,
    );
  });

  describe('Deployment', async () => {
    it('should deployed', async function () {
      expect(splitableFactory.address).to.not.equal('');
    });

    it('should create splitable', async () => {
      expect(splitableFactory.createSplitable()).not.to.be.reverted;
    });
  });
});
