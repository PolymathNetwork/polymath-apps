const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const {
  TEMP_BLOCKCHAIN_STATE_DIR,
  BLOCKCHAIN_GAS_LIMIT,
  BLOCKCHAIN_MNEMONIC,
  BLOCKCHAIN_NETWORK_ID,
  PACKAGE_ROOT_DIR,
} = require('./constants');
const { runCommand } = require('../utils');

async function copyArtifactsFromCore() {
  const coreArtifactsDir = path.resolve(
    PACKAGE_ROOT_DIR,
    '../../node_modules/polymath-core/build'
  );
  await fs.copy(coreArtifactsDir, path.resolve(__dirname, './build'));
}

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
    `--gasLimit ${BLOCKCHAIN_GAS_LIMIT}`,
    // Set a network id for ganache
    `-i=${BLOCKCHAIN_NETWORK_ID}`,
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
  moveFilesAndCleaup,
  copyArtifactsFromCore,
};
