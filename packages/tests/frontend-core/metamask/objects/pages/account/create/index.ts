import { page } from "../../../../../browser/puppeteer";


export class Create {
    private selector = '#password-box';
    private password = '#password-box';
    private passwordConfirm = '#password-box-confirm';
    private firstButton = 'button';
    private secondButton = './/button[contains(@class, "primary" and text()="I\'ve copied it somewhere safe"';
    public async set({ password }) {
        await page.waitForSelector(this.selector);
        await page.type(this.password, password);
        await page.type(this.passwordConfirm, password);
    }
    public async next() {
        await page.waitForSelector(this.selector);
        await page.click(this.firstButton);
        await page.click(this.secondButton);
    }
}