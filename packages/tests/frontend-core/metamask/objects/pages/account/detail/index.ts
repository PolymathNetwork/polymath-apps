import { page } from "../../../../../browser/puppeteer";



export class DetailExtra {
    public selector = '.account-modal-container';
    public accountName = '.editable-label__value';
    public ethAddress = '.qr-ellip-address';
    public async get() {
        await page.waitForSelector(this.selector);
        return {
            name: await page.$eval(this.accountName, e => e.textContent),
            ethAddress: await page.$eval(this.ethAddress, e => e.textContent)
        }
    }
    public async close(): Promise<void> {
        // We can't click on an 'after' effect
        await page.click('body');
    }
}

export class Detail {
    protected selector = '.account-and-transaction-details';
    public name = '.account-name';
    public ethAmount = '.wallet-balance .token-amount';
    public async wait() {
        await page.waitForSelector(this.selector);
    }
    public async get() {
        await page.waitForSelector(this.selector);
        return {
            name: await page.$eval(this.name, e => e.textContent),
            ethAmount: parseFloat(await page.$eval(this.ethAmount, e => e.textContent))
        }
    }
    public async extraDetails(): Promise<DetailExtra> {
        await page.waitForSelector('not(.loading-overlay)');
        await page.click('.wallet-view__details-button');
        return new DetailExtra();
    }
}