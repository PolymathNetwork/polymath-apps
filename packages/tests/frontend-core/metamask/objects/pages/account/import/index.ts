import { page } from "../../../../../browser/puppeteer";

export class Import {
    protected selector = '.import-account';
    public password = '#password';
    public passwordConfirm = '#confirm-password';
    public seed = 'textarea';
    public async set({ seed, password }) {
        await page.type(this.password, password)
        await page.type(this.passwordConfirm, password)
        await page.type(this.seed, seed);
    }
    public async next(): Promise<void> {
        await page.click('button');
    }
}