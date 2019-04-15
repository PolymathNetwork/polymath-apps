import cheerio = require('cheerio');
import * as request from 'request-promise-native';
import { MetamaskData } from '../shared';
import { GetFileExtensionForBrowser, Browser } from '../shared';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as tmp from 'tmp';


export abstract class MetamaskDownloader {
    public static extensions: { [k: string]: { new(...args): MetamaskDownloader } } = {};
    public static Register(extension: { new(...args): MetamaskDownloader }, type: Browser) {
        this.extensions[type] = extension;
    }
    public static Get(browser: Browser): Promise<MetamaskData> {
        let br = this.extensions[browser];
        if (!br) throw `Metamask is not registered for ${Browser[browser]}`;
        return new br().getExtension();
    }
    public abstract async getExtension(): Promise<MetamaskData>;

    protected async getRelease(browser: Browser, version: string = process.env.TEST_MM_VERSION || 'latest') {
        let url = version && version !== 'latest' ? `https://github.com/MetaMask/metamask-extension/releases/tag/v${version}`
            : 'https://github.com/MetaMask/metamask-extension/releases/latest';
        let html = await request.get(url, { followAllRedirects: true });
        let search = (cheerio as any).load(html);
        let found = search(`a[href*="metamask-${Browser[browser].toLowerCase()}"]`);
        if (!found) return null;
        let downloaded = tmp.fileSync({
            prefix: `metamask-extension-${Browser[browser]}`,
            postfix: `.${GetFileExtensionForBrowser(browser)}`
        });
        await new Promise<void>((r, e) => request.get(`https://github.com${found.attr('href')}`, { followAllRedirects: true })
            .on('error', e)
            .pipe(fs.createWriteStream(downloaded.name)
                .on('finish', r)
                .on('error', e)));
        let folder = tmp.dirSync({ prefix: `metamask-extension-${Browser[browser]}` });
        await new Promise((r, e) => fs.createReadStream(downloaded.name)
            .pipe(unzipper.Extract({ path: folder.name }))
            .on('close', r)
            .on('error', e));
        return { compressed: downloaded, uncompressed: folder };
    }
}