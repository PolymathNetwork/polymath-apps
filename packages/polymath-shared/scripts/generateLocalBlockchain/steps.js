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
    '-d',
  ].join(' ');

  return new Promise((resolve, reject) => {
    fs.ensureDirSync(TEMP_BLOCKCHAIN_STATE_DIR);

    const ganacheCLI = exec(`yarn ganache-cli ${ganacheArgs}`, {
      cwd: PACKAGE_ROOT_DIR,
    });

    ganacheCLI.stdout.setEncoding('utf8');
    ganacheCLI.stderr.setEncoding('utf8');

    ganacheCLI.stdout.on('data', data => {
      console.log(data);
      if (data.includes('Listening on')) {
        resolve();
      }
    });
    ganacheCLI.stderr.on('data', err => {
      reject(err);
    });
    ganacheCLI.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });
    process.on('exit', () => {
      ganacheCLI.kill('SIGINT');
    });
  });
}

async function migrateContracts() {
  console.log('===> Migrating contracts');

  return new Promise((resolve, reject) => {
    const migration = exec(
      'truffle migrate --network=development --reset --all',
      {
        cwd: __dirname,
      }
    );
    migration.stdout.setEncoding('utf8');
    migration.stderr.setEncoding('utf8');

    migration.stdout.on('data', data => {
      console.log(data);
    });
    migration.stderr.on('data', err => {
      reject(err);
    });
    migration.on('close', resolve);
  });
}

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
  process.exit(0);
}

module.exports = {
  startGanacheCLI,
  migrateContracts,
  moveFilesAndCleaup,
  copyArtifactsFromCore,
};
