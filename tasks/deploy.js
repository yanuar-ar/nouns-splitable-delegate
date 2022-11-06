const { task } = require('hardhat/config');

task('deploy', 'Deploy contract').setAction(async ({}, { ethers, upgrades }) => {
  const SplitableFactory = await ethers.getContractFactory('SplitableFactory');

  const splitableFactory = await SplitableFactory.deploy('', { gasLimit: 3000000 });

  await splitableFactory.deployed();

  console.log('Contract deployed to: ', splitableFactory.address);
});
