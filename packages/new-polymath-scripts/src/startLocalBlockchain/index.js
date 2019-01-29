const { runCommand, startCli } = require('../utils');
const { PACKAGE_ROOT_DIR } = require('../constants');

(async () => {
  await runCommand('yarn local-blockchain:prepare', {
    cwd: PACKAGE_ROOT_DIR,
  });

  let [, , flag0, arg0, flag1, arg1] = process.argv;

  if (flag1 && flag1 !== 'seedData') {
    [flag0, flag1] = [flag1, flag0];
    [arg0, arg1] = [arg1, arg0];
  }

  if (flag0 !== '-e') {
    throw new Error(`Invalid flag "${flag0}", should be "-e"`);
  } else if (isNaN(arg0)) {
    throw new Error('Must supply a numerical value for "-e"');
  }

  await startCli(`${PACKAGE_ROOT_DIR}/build/fixtures/blockchain-state`, {
    initialEther: arg0,
  });

  await runCommand(
    `yarn local-blockchain:seed ${flag1 ? `${flag1} ${arg1}` : ''}`,
    {
      cwd: PACKAGE_ROOT_DIR,
    }
  );
})().catch(console.log);
