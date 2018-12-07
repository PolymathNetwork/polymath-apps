import fs from 'fs-extra';
import path from 'path';

import {
  TEMP_BLOCKCHAIN_STATE_DIR,
  BLOCKCHAIN_GAS_LIMIT,
  BLOCKCHAIN_MNEMONIC,
  BLOCKCHAIN_NETWORK_ID,
  BLOCKCHAIN_URL,
  WALLET_ADDRESSES,
  DAI_AMOUNT,
  LOCAL_PRIVATE_KEY,
  GAS_PRICE,
  INITIAL_ETHER,
  PACKAGE_ROOT_DIR,
} from './constants';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import { runCommand } from '~/utils';
import BigNumber from 'bignumber.js';
import { Artifacts } from 'truffle';
/**
 * Starts local blockchain through ganache-cli
 * Resolves once the local blockchain finishes booting
 */
async function startGanacheCLI() {
  console.log('==> Starting Ganache CLI');

  const ganacheArgs = [
    // Set a directory to which ganache will write the state to
    `--db="${TEMP_BLOCKCHAIN_STATE_DIR}"`,
    // Set the block gas limit
    `--gasLimit=${BLOCKCHAIN_GAS_LIMIT}`,
    // Set a network id for ganache
    `-i=${BLOCKCHAIN_NETWORK_ID}`,
    // Set an initial amount of ether for all wallets
    `-e=${INITIAL_ETHER}`,
    `--mnemonic="${BLOCKCHAIN_MNEMONIC}"`,
    // Sets deterministic mode to ensure same accounts everytime
    '-d',
  ].join(' ');

  fs.ensureDirSync(TEMP_BLOCKCHAIN_STATE_DIR);

  await runCommand(`yarn ganache-cli ${ganacheArgs}`, {
    cwd: PACKAGE_ROOT_DIR,
    isReady: data => data.includes('Listening on'),
  });
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
  const web3 = new Web3(BLOCKCHAIN_URL);
  const PolyTokenFaucetArtifact = require('./build/contracts/PolyTokenFaucet.json');
  const address =
    PolyTokenFaucetArtifact.networks[BLOCKCHAIN_NETWORK_ID].address;
  const abi = PolyTokenFaucetArtifact.abi;

  const faucet = new web3.eth.Contract(abi, address);

  console.log('===> Transferring DAI');
  for (let beneficiary of WALLET_ADDRESSES) {
    const action = faucet.methods.getTokens(
      web3.utils.toWei(DAI_AMOUNT),
      beneficiary
    );

    let block = await web3.eth.getBlock('latest');
    let networkGasLimit = block.gasLimit;

    const userAccount = await web3.eth.accounts.privateKeyToAccount(
      LOCAL_PRIVATE_KEY
    );

    let gas = Math.round(
      1.2 *
        (await action.estimateGas({
          from: userAccount.address,
          value: undefined,
        }))
    );
    if (gas > networkGasLimit) gas = networkGasLimit;

    let nonce = await web3.eth.getTransactionCount(userAccount.address);
    let actionABI = action.encodeABI();
    let txParams = {
      from: userAccount.address,
      to: address,
      data: actionABI,
      gasLimit: gas,
      gasPrice: GAS_PRICE,
      nonce,
      value: undefined,
    };

    const transaction = new Tx(txParams);
    transaction.sign(
      Buffer.from(userAccount.privateKey.replace('0x', ''), 'hex')
    );
    await web3.eth.sendSignedTransaction(
      '0x' + transaction.serialize().toString('hex')
    );
    let balance = await faucet.methods.balanceOf(beneficiary).call();
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

export {
  startGanacheCLI,
  compileContracts,
  migrateContracts,
  transferDAI,
  moveFilesAndCleaup,
};
