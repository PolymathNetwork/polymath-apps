const { runCommand, startCli } = require('../utils');
const { PACKAGE_ROOT_DIR } = require('../constants');

(async () => {
  await runCommand('yarn local-blockchain:prepare', {
    cwd: PACKAGE_ROOT_DIR,
  });

  await startCli(`${PACKAGE_ROOT_DIR}/build/fixtures/blockchain-state`);

  const [, , flag, arg] = process.argv;
  await runCommand(
    `yarn local-blockchain:seed ${flag ? `${flag} ${arg}` : ''}`,
    {
      cwd: PACKAGE_ROOT_DIR,
    }
  );
})().catch(console.log);
