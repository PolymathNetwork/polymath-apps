/**
 * This script will generate the files required to enable a predictable
 * local blockchain state on every run.
 *
 * It runs ganache on deterministic mode with a hard-coded mnemonic,
 * then it migrates the latest version of the smart contracts and saves
 * them together with a snapshot of the local blockchain's state
 */

const { execSync } = require('child_process');
const fs = require('fs');
const steps = require('./steps');
const { TEMP_DIR } = require('../constants');

// Recreate new temp folder
if (fs.existsSync(TEMP_DIR)) {
  execSync(`rm -rf ${TEMP_DIR}`);
}
fs.mkdirSync(TEMP_DIR);

(async () => {
  await steps.startGanacheCLI();
  await steps.compileContracts();
  await steps.migrateContracts();
  await steps.transferDAI();
  await steps.moveFilesAndCleaup();

  // We kill the process since asyncronous tasks could be running
  process.exit(0);
})().catch(console.error);
