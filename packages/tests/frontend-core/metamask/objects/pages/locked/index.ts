import { Import } from "../account/import";
import { page } from "../../../../browser/puppeteer";

export class Locked {
    protected selector = '.create-password__import-link';
    public password = '#create-password';
    public passwordConfirm = '#confirm-password';
    public async set({ password }) {
        await page.waitForSelector(this.selector);
        await page.type(this.password, password)
        await page.type(this.passwordConfirm, password);
    }
    public async next(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('button')
    }
    public async import(): Promise<Import> {
        await page.waitForSelector(this.selector);
        await page.click('.create-password__import-link');
        return new Import();
    }
}