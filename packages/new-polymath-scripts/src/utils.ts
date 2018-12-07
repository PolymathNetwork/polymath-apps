import { exec, ExecOptions } from 'child_process';

type Options = {
  onData?: (data: string) => void;
  isReady?: ((data: string) => boolean);
} & ExecOptions;

async function runCommand(
  command: string,
  { onData, isReady, ...execOpts }: Options
): Promise<{}> {
  return new Promise(resolve => {
    const cmd = exec(command, { ...execOpts });

    cmd.stdout.setEncoding('utf8');
    cmd.stderr.setEncoding('utf8');

    cmd.stdout.on('data', (data: string) => {
      console.log(data); // tslint:disable-line no-console
      if (onData) {
        onData(data);
      }

      if (isReady && isReady(data)) {
        resolve();
      }
    });
    cmd.stderr.on('data', error => {
      console.log('ERROR:', error); // tslint:disable-line no-console
      throw new Error(error);
    });

    cmd.on('close', code => {
      console.log(`child process exited with code ${code}`); // tslint:disable-line no-console
      resolve();
    });

    process.on('exit', () => {
      cmd.kill('SIGINT');
    });
  });
}

export { runCommand };
