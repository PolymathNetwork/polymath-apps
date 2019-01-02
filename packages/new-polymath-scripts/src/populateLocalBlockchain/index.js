const { sendTransaction, web3 } = require('../utils');
const { BLOCKCHAIN_NETWORK_ID, STATE_DOCUMENT_PATH } = require('../constants');
const wallets = require('./wallets.json');
const fs = require('fs');
const _ = require('lodash');

function consoleOutput(data) {
  let output = '\n\n========== INITIAL STATE ==========';

  _.forEach(data, (account, index) => {
    let mintedBalances = '';

    const { mintedTokens, tokens: issuedTokens, walletId } = account;
    const { address } = wallets[walletId];
    _.forEach(mintedTokens, minted => {
      mintedBalances = `${mintedBalances}
    - ${minted.symbol}: ${minted.amount}`;
    });

    let issuedTokensOutput = issuedTokens ? '  ** Issued Tokens **' : '';

    _.forEach(issuedTokens, token => {
      issuedTokensOutput = `${issuedTokensOutput}
    - ${token.symbol} (${token.name}, ${
        token.divisible ? 'divisible' : 'non-divisible'
      })`;
    });

    output = `${output}
    
Account ${walletId} (${address}):
  ** Balances **
    - POLY: ${account.polyBalance}${mintedBalances}
`;

    if (issuedTokensOutput) {
      output = `${output}${issuedTokensOutput}`;
    } else {
      output = `${output}\n`;
    }
  });

  return output;
}

function markdownOutput(data) {
  let output = '# INITIAL STATE';

  _.forEach(data, (account, index) => {
    let mintedBalances = '';

    const { mintedTokens, tokens: issuedTokens, walletId } = account;
    const { address } = wallets[walletId];
    _.forEach(mintedTokens, minted => {
      mintedBalances = `${mintedBalances}
  - ${minted.symbol}: ${minted.amount}`;
    });

    let issuedTokensOutput = issuedTokens ? '#### Issued Tokens' : '';

    _.forEach(issuedTokens, token => {
      issuedTokensOutput = `${issuedTokensOutput}
  - ${token.symbol} (${token.name}, ${
        token.divisible ? 'divisible' : 'non-divisible'
      })`;
    });

    output = `${output}
    
### Account ${index + 1} (${address}):

#### Balances
  - POLY: ${account.polyBalance}${mintedBalances}`;

    if (issuedTokensOutput) {
      output = `${output}\n\n${issuedTokensOutput}`;
    }
  });

  return output;
}

/**
 * Generates required blockchain state for local testing
 */
async function seedData(dataFile) {
  if (fs.existsSync(STATE_DOCUMENT_PATH)) fs.unlinkSync(STATE_DOCUMENT_PATH);

  const accounts = require(`./${dataFile}`).accounts;

  const PolymathRegistryArtifact = require('../fixtures/contracts/PolymathRegistry.json');
  const SecurityTokenRegistryArtifact = require('../fixtures/contracts/SecurityTokenRegistry.json');
  const PolyTokenFaucetArtifact = require('../fixtures/contracts/PolyTokenFaucet.json');
  const SecurityTokenArtifact = require('../fixtures/contracts/SecurityToken.json');
  const GeneralTransferManagerArtifact = require('../fixtures/contracts/GeneralTransferManager.json');

  const PolymathRegistry = new web3.eth.Contract(
    PolymathRegistryArtifact.abi,
    PolymathRegistryArtifact.networks[BLOCKCHAIN_NETWORK_ID].address
  );

  const strAddress = await PolymathRegistry.methods
    .getAddress('SecurityTokenRegistry')
    .call();

  const SecurityTokenRegistry = new web3.eth.Contract(
    SecurityTokenRegistryArtifact.abi,
    strAddress
  );

  const polyTokenAddress = await PolymathRegistry.methods
    .getAddress('PolyToken')
    .call();

  const PolyTokenFaucet = new web3.eth.Contract(
    PolyTokenFaucetArtifact.abi,
    polyTokenAddress
  );

  const outputData = _.cloneDeep(accounts);

  console.log('Generating seed data...');
  for (let i = 0; i < accounts.length; ++i) {
    const account = accounts[i];
    const wallet = wallets[account.walletId];
    const { address, privateKey } = wallet;

    const userAccount = await web3.eth.accounts.privateKeyToAccount(privateKey);

    const getPoly = PolyTokenFaucet.methods.getTokens(
      web3.utils.toWei(String(account.polyBalance)),
      address
    );

    await sendTransaction(userAccount, getPoly, polyTokenAddress);

    const registrationFee = await SecurityTokenRegistry.methods
      .getTickerRegistrationFee()
      .call();
    const launchFee = await SecurityTokenRegistry.methods
      .getSecurityTokenLaunchFee()
      .call();

    const tokens = account.tokens;

    if (!tokens) {
      continue;
    }

    for (let j = 0; j < tokens.length; ++j) {
      const token = tokens[j];
      const { name, symbol, divisible } = token;

      let approveSpend = PolyTokenFaucet.methods.approve(
        strAddress,
        registrationFee
      );

      await sendTransaction(userAccount, approveSpend, polyTokenAddress);

      const registerTicker = SecurityTokenRegistry.methods.registerTicker(
        address,
        symbol,
        name
      );
      await sendTransaction(userAccount, registerTicker, strAddress);

      approveSpend = PolyTokenFaucet.methods.approve(strAddress, launchFee);
      await sendTransaction(userAccount, approveSpend, polyTokenAddress);

      const launchToken = SecurityTokenRegistry.methods.generateSecurityToken(
        name,
        symbol,
        '',
        divisible
      );
      await sendTransaction(userAccount, launchToken, strAddress);

      const tokenAddress = await SecurityTokenRegistry.methods
        .getSecurityTokenAddress(symbol)
        .call();

      const SecurityToken = new web3.eth.Contract(
        SecurityTokenArtifact.abi,
        tokenAddress
      );

      const gtmModules = await SecurityToken.methods
        .getModulesByName(web3.utils.toHex('GeneralTransferManager'))
        .call();
      const gtmAddress = gtmModules[0];

      const GeneralTransferManager = new web3.eth.Contract(
        GeneralTransferManagerArtifact.abi,
        gtmAddress
      );

      const minted = token.minted;

      if (!minted) {
        continue;
      }

      const addressesToMint = [];
      const amountsToMint = [];

      for (let k = 0; k < minted.length; ++k) {
        const mint = minted[k];
        const { amount, shareholderId } = mint;
        const shareholderWallet = wallets[shareholderId];
        const { address: shareholderAddress } = shareholderWallet;

        addressesToMint.push(web3.utils.toChecksumAddress(shareholderAddress));
        amountsToMint.push(web3.utils.toWei(String(amount)));

        const accountOutput = _.find(
          outputData,
          outputAcc => shareholderId === outputAcc.walletId
        );
        accountOutput.mintedTokens = accountOutput.mintedTokens || [];
        accountOutput.mintedTokens.push({
          symbol,
          amount,
        });

        const now = new Date();
        const oneYearFromNow = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );
        const oneYearFromNowTimestamp = Math.floor(
          oneYearFromNow.getTime() / 1000
        );
        const modifyWhitelist = GeneralTransferManager.methods.modifyWhitelist(
          shareholderAddress,
          Math.floor(now.getTime() / 1000),
          oneYearFromNowTimestamp,
          oneYearFromNowTimestamp,
          true
        );

        await sendTransaction(userAccount, modifyWhitelist, gtmAddress);
      }
      const mintMulti = SecurityToken.methods.mintMulti(
        addressesToMint,
        amountsToMint
      );

      await sendTransaction(userAccount, mintMulti, tokenAddress);
    }
  }

  fs.writeFileSync(STATE_DOCUMENT_PATH, markdownOutput(outputData));

  console.log(consoleOutput(outputData));
}

(async () => {
  const [, , flag, arg] = process.argv;
  if (flag) {
    if (flag !== '--seedData') {
      throw new Error(`Invalid option ${flag}, did you mean '--seedData'?`);
    }

    if (!arg) {
      throw new Error(`No value set for option '${flag}'`);
    }
  }
  const dataFile = arg || 'seedData.json';
  console.log(`Reading seed data from "${dataFile}"`);
  await seedData(dataFile);
})().catch(console.log);
