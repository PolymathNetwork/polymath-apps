
import { MetamaskDownloader } from "./browsers";
import { MetamaskOptions, Network, Browser, MetamaskData } from "./shared";
import { MetamaskPage } from "./objects/pages";
import { Locked } from "./objects/pages/locked";
import { Create } from "./objects/pages/account/create";
import { Detail } from "./objects/pages/account/detail";
import { Settings } from "./objects/features/settings";
import { NetworkManager } from "./objects/features/network";
import { Transaction, Sign } from "./objects/pages/transaction";
import { AccountManager } from "./objects/features/account";
import { WelcomeMetamaskBeta, Terms } from "./objects/pages/terms";
import { Import } from "./objects/pages/account/import";
import { browser, Puppeteer, page } from "../browser/puppeteer";


export class Metamask {
    private static _instance: Metamask;
    public static get instance(): Metamask {
        return this._instance || (this._instance = new Metamask());
    };
    public static async Get(browser: Browser): Promise<MetamaskData> {
        let extension = await MetamaskDownloader.Get(browser);
        process.env.METAMASK_URL = extension.extensionId;
        this._instance = new Metamask(extension);
        return extension;
    }
    public options: MetamaskOptions = {
        // If you want to use the following extension id, set this key in your manifest.json
        // "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlcgI4VVL4JUvo6hlSgeCZp9mGltZrzFvc2Asqzb1dDGO9baoYOe+QRoh27/YyVXugxni480Q/R147INhBOyQZVMhZOD5pFMVutia9MHMaZhgRXzrK3BHtNSkKLL1c5mhutQNwiLqLtFkMSGvka91LoMEC8WTI0wi4tACnJ5FyFZQYzvtqy5sXo3VS3gzfOBluLKi7BxYcaUJjNrhOIxl1xL2qgK5lDrDOLKcbaurDiwqofVtAFOL5sM3uJ6D8nOO9tG+T7hoobRFN+nxk43PHgCv4poicOv+NMZQEk3da1m/xfuzXV88NcE/YRbRLwAS82m3gsJZKc6mLqm4wZHzBwIDAQAB",
        extensionId: process.env.METAMASK_URL || 'nkbihfbeogaeaoehlefnkodbefgpgknn',
    }
    // New MM versions changed this
    public get extensionUrl() { return `chrome-extension://${this.options.extensionId}/home.html`; }
    public constructor(options?: MetamaskOptions) {
        if (options) this.options = options;
    }

    public async navigateToPage() {
        let p = await browser.newPage();
        Puppeteer.currentPage = p;
        await page.goto(this.extensionUrl);
        await MetamaskPage.RemoveCss();
        return this;
    }
    public async exitPage() {
        await page.close();
        await Puppeteer.setCurrentPage();
    }
    public async acceptTerms() {
        await new Terms().next();
        await new Terms().next();
        await new Terms().next();
        await new Detail().wait();
        return this;
    }
    public async createAccount(password: string = "password1234") {
        await this.acceptTerms();
        let create = new Create();
        await create.set({ password });
        await create.next();
        return this;
    }
    public async importAccount(seed: string, password = 'password1234') {
        let locked = await new WelcomeMetamaskBeta().next();
        let imp = await locked.import();
        await imp.set({ seed, password });
        await imp.next();
        return this;
    }
    public async lock() {
        await new Settings().lock();
        return this;
    }
    public async unlock(password = 'password1234') {
        let page = new Locked();
        await page.set({ password });
        await page.next();
        return this;
    }

    public async setSettings(opts: { privacyMode: boolean, customRpc: string }) {
        let settings = await new Settings().settings();
        await settings.set(opts);
        return this;
    }

    public async switchNetwork(network: Network = Network.Main) {
        let settings = await new Settings().settings();
        let local = process.env.TEST_LOCALHOST;
        let port = process.env.TEST_GANACHE_PORT;
        let opts = { privacyMode: undefined, customRpc: undefined };
        if (process.env.TEST_DISABLE_PRIVACY_MODE) {
            opts.privacyMode = false;
        }
        if ((local || port) && network === Network.Localhost) {
            local = local || 'localhost';
            port = port || '8545';
            opts.customRpc = `http://${local}:${port}`;
            await settings.set(opts);
            await settings.close();
        } else await new NetworkManager().next(network);
        return this;
    }

    // TODO: Add changing an account
    // TODO: Make sure to switch to the original page after interacting with metamask
    // TODO: Refresh the page multiple times if the transaction is not appearing still
    public async confirmTransaction(opts?: { gasLimit?: number, gas?: number, cancel?: boolean }) {
        let transaction = new Transaction();
        if (opts && opts.cancel) await transaction.cancel();
        else await transaction.next();
        return this;
    }

    public async sign(opts?: { cancel?: boolean }) {
        let transaction = new Sign();
        if (opts && opts.cancel) await transaction.cancel();
        else await transaction.next();
        return this;
    }

    public async switchAccount(name?: string | number) {
        let manager = new AccountManager();
        if (!name) await manager.create();
        else if (!isNaN(name as number)) {
            let accounts = await new AccountManager().get();
            for (let i = accounts.length; i < name; ++i) {
                await manager.create();
            }
        }
        else await manager.select(name as string);
        return this;
    }

    public async accountInfo(): Promise<{ name: string, ethAmount: number, ethAddress: string }> {
        let details = new Detail();
        let res = await details.get();
        let extra = await (await details.extraDetails()).get();
        return { name: res.name, ethAmount: res.ethAmount, ethAddress: extra.ethAddress };
    }
}