const fs = require('fs-extra');
const path = require('path');
const {
  TEMP_BLOCKCHAIN_STATE_DIR,
  BLOCKCHAIN_NETWORK_ID,
  WALLET_ADDRESSES,
  DAI_AMOUNT,
  LOCAL_PRIVATE_KEY,
  PACKAGE_ROOT_DIR,
} = require('../constants');
const { runCommand, web3, sendTransaction, startCli } = require('../utils');
const BigNumber = require('bignumber.js');

/**
 * Starts local blockchain through ganache-cli
 * Resolves once the local blockchain finishes booting
 */
async function startGanacheCLI() {
  console.log('==> Starting Ganache CLI');

  await startCli(TEMP_BLOCKCHAIN_STATE_DIR);
}

/**
 * Compiles JSON artifacts from contracts
 */
async function compileContracts() {
  console.log('===> Compiling contracts');

  await runCommand('truffle compile --optimize-runs 200', {
    cwd: __dirname,
  });
}

/**
 * Deploys contracts to the local blockchain
 */
async function migrateContracts() {
  console.log('===> Migrating contracts');

  await runCommand('truffle migrate --network=development --reset --all', {
    cwd: __dirname,
  });
}

/**
 * Transfers 1 Million POLY (disguised as USD tokens) to each wallet
 */
async function transferDAI() {
  const PolyTokenFaucetArtifact = require('./build/contracts/PolyTokenFaucet.json');
  const address =
    PolyTokenFaucetArtifact.networks[BLOCKCHAIN_NETWORK_ID].address;
  const abi = PolyTokenFaucetArtifact.abi;

  const Dai = new web3.eth.Contract(abi, address);

  console.log('===> Transferring DAI');
  for (let beneficiary of WALLET_ADDRESSES) {
    const action = Dai.methods.getTokens(
      web3.utils.toWei(DAI_AMOUNT),
      beneficiary
    );

    const userAccount = await web3.eth.accounts.privateKeyToAccount(
      LOCAL_PRIVATE_KEY
    );

    await sendTransaction(userAccount, action, address);

    let balance = await Dai.methods.balanceOf(beneficiary).call();
    let balanceInPoly = new BigNumber(balance).dividedBy(
      new BigNumber(10).pow(18)
    );
    console.log(
      `  ...DAI transferred to ${beneficiary}, balance: ${balanceInPoly.toNumber()}`
    );
  }
}

/**
 * Copies the relevant files into the repo and removes temp files
 */
async function moveFilesAndCleaup() {
  const contractsTargetDir = path.resolve(
    PACKAGE_ROOT_DIR,
    './src/fixtures/contracts'
  );
  const blockchainStateTargetDir = path.resolve(
    PACKAGE_ROOT_DIR,
    './src/fixtures/blockchain-state'
  );
  const tempContractsDir = path.resolve(__dirname, './build/contracts');

  console.log('===> Copying fixtures');
  await fs.remove(contractsTargetDir);
  await fs.copy(tempContractsDir, contractsTargetDir);
  await fs.remove(blockchainStateTargetDir);
  await fs.copy(TEMP_BLOCKCHAIN_STATE_DIR, blockchainStateTargetDir);

  console.log('===> Cleaning up');
  await fs.remove(TEMP_BLOCKCHAIN_STATE_DIR);
  await fs.remove(tempContractsDir);
  console.log(
    '===> New blockchain state generated successfully.\nRemember to commit the changes!'
  );
}

module.exports = {
  startGanacheCLI,
  compileContracts,
  migrateContracts,
  transferDAI,
  moveFilesAndCleaup,
};
