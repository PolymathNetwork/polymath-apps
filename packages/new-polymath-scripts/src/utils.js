const { exec } = require('child_process');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const fs = require('fs-extra');
const {
  BLOCKCHAIN_GAS_LIMIT,
  BLOCKCHAIN_MNEMONIC,
  BLOCKCHAIN_NETWORK_ID,
  BLOCKCHAIN_URL,
  GAS_PRICE,
  ACCOUNT_NUMBER,
  INITIAL_ETHER,
  PACKAGE_ROOT_DIR,
} = require('./constants');

const web3 = new Web3(BLOCKCHAIN_URL);

async function runCommand(
  command,
  { onData = () => {}, isReady = null, ...opts } = {}
) {
  return new Promise(resolve => {
    const cmd = exec(command, { ...opts });
    const isAsyncCommand = !!isReady;

    cmd.stdout.setEncoding('utf8');
    cmd.stderr.setEncoding('utf8');

    cmd.stdout.on('data', data => {
      console.log(data);
      onData(data);

      if (isAsyncCommand && isReady(data)) {
        resolve(cmd);
      }
    });
    cmd.stderr.on('data', error => {
      console.log('ERROR:', error);
      throw new Error(error);
    });

    cmd.on('close', code => {
      console.log(`child process exited with code ${code}`);
      resolve(cmd);
    });

    process.on('exit', () => {
      cmd.kill('SIGINT');
    });
  });
}

async function sendTransaction(userAccount, action, address) {
  let block = await web3.eth.getBlock('latest');
  let networkGasLimit = block.gasLimit;

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
}

async function startCli(db, opts = {}) {
  let { initialEther } = opts;

  if (!initialEther) {
    initialEther = INITIAL_ETHER;
  }

  const ganacheArgs = [
    // Set a directory to which ganache will write the state to
    `--db="${db}"`,
    // Set the block gas limit
    `--gasLimit=${BLOCKCHAIN_GAS_LIMIT}`,
    // Set a network id for ganache
    `-i=${BLOCKCHAIN_NETWORK_ID}`,
    // Set an initial amount of ether for all wallets
    `-e=${initialEther}`,
    `--mnemonic="${BLOCKCHAIN_MNEMONIC}"`,
    `--accounts=${ACCOUNT_NUMBER}`,
    // Sets deterministic mode to ensure same accounts everytime
    '-d',
  ].join(' ');

  fs.ensureDirSync(db);

  return await runCommand(`yarn ganache-cli ${ganacheArgs}`, {
    cwd: PACKAGE_ROOT_DIR,
    isReady: data => data.includes('Listening on'),
  });
}

module.exports = {
  runCommand,
  sendTransaction,
  web3,
  startCli,
};
