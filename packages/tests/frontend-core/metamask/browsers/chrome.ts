import * as fs from 'fs-extra';
import * as path from 'path';
import ChromeExtension = require('crx');
import rsa = require('node-rsa');
import { MetamaskDownloader } from ".";
import { Browser, MetamaskData } from "../shared";


class ChromeMetamask extends MetamaskDownloader {
    public async getExtension(): Promise<MetamaskData> {
        let contents = await this.getRelease(Browser.Chrome);
        let result: MetamaskData = {
            file: contents.compressed,
            uncompressed: contents.uncompressed,
            afterExecution: () => {
                fs.removeSync(contents.compressed);
                fs.removeSync(contents.uncompressed);
            },
            extensionId: null
        };
        // Repack the extension
        let manifestFile = path.join(contents.uncompressed.name, 'manifest.json');
        let manifest = JSON.parse(fs.readFileSync(manifestFile).toString());
        var key = new rsa({ b: 2048 }, 'private', {}),
            keyVal = key.exportKey('private');
        let crx = new ChromeExtension({
            privateKey: keyVal,
        });
        crx = await crx.load(contents.uncompressed.name);
        let publicKey = await crx.generatePublicKey();
        manifest.key = publicKey.toString('base64');
        result.extensionId = await crx.generateAppId(publicKey);
        console.log(`Registering extension with uuid ${result.extensionId}`)
        fs.writeFileSync(manifestFile, JSON.stringify(manifest), { encoding: 'utf8' });
        crx = new ChromeExtension({
            privateKey: keyVal,
            publicKey: manifest.key,
            appId: result.extensionId
        });
        crx = await crx.load(contents.uncompressed.name);
        let crxBuffer = await crx.pack();
        fs.writeFileSync(contents.compressed.name, crxBuffer);
        return result;
    }
}

MetamaskDownloader.Register(ChromeMetamask, Browser.Chrome);