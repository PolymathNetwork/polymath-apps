import { NetworkManager } from "../features/network";
import { Settings } from "../features/settings";
import { AccountManager } from "../features/account";
import { page } from "../../../browser/puppeteer";


export abstract class MetamaskPage {
    protected featureSelector = 'body';
    public network: NetworkManager;
    public settings: Settings;
    public account: AccountManager;
    public static async RemoveCss() {
        // Remove styles from html and body
        await page.$eval('body', e => e.setAttribute('style', ""));
        await page.$eval('html', e => e.setAttribute('style', ""));
    }
}