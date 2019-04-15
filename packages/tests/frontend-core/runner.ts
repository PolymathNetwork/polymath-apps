import { argv } from 'yargs';
import { getBrowserInfo } from 'testcafe-browser-tools';
const testCafeFactory = require('testcafe');
import { Metamask } from './metamask';
import { Browser } from './metamask/shared';
const getPort = require('get-port');
import { dirSync } from 'tmp';

let chromeInfo: { cmd: string } = null;
let downloader = null;

getBrowserInfo('chrome')
    .then(async (info: { cmd: string }) => {
        chromeInfo = info;
        downloader = argv.metamaskPath || (await Metamask.Get(Browser.Chrome)).uncompressed.name;
        let tmp = dirSync({ prefix: 'puppeteer' });
        chromeInfo.cmd = `chrome --load-extension=${downloader} --remote-debugging-port=${process.env.PORT || (process.env.PORT = await getPort())} --user-data-dir=${tmp.name} ${chromeInfo.cmd}`;   // add your flags here
    })
    .then(() => testCafeFactory('localhost', 1337, 1338))
    .then((testcafe) => {
        process.on('SIGINT', () => {
            testcafe.close();
        });
        process.on('exit', () => {
            testcafe.close();
        });
        process.on('uncaughtException', function (err) {
            console.error((err && err.stack) ? err.stack : err);
            debugger;
            if (err) testcafe.close();
        });
        return testcafe
            .createRunner()
            .src(argv.src || 'auth/sign.ts')
            .browsers(chromeInfo)
            .run();
    }).then((failed: number) => {
        console.log(`Failed test cases: ${failed}`);
    });

