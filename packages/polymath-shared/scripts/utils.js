const { exec } = require('child_process');

async function runCommand(
  command,
  { onData = () => {}, isReady = null, ...opts } = {}
) {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, { ...opts });
    const isAsyncCommand = !!isReady;

    cmd.stdout.setEncoding('utf8');
    cmd.stderr.setEncoding('utf8');

    cmd.stdout.on('data', data => {
      console.log(data);
      onData(data);

      if (isAsyncCommand && isReady(data)) {
        resolve();
      }
    });
    cmd.stderr.on('data', error => {
      throw new Error(error);
    });

    cmd.on('close', code => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });

    process.on('exit', () => {
      cmd.kill('SIGINT');
    });
  });
}

module.exports = {
  runCommand,
};
