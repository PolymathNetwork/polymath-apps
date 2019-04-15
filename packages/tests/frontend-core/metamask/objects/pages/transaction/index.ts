import { page } from "../../../../browser/puppeteer";

export class Sign {
    protected selector = '.request-signature__container';
    public async next(): Promise<void> {
        let done = false;
        for (let i = 0; i < 10; ++i) {
            try {
                await page.waitForSelector(this.selector, { timeout: 1000 });
                break;
            } catch (notFound) {
                if (i = 10) throw notFound;
                await page.reload();
            }
        }
        await page.click('.btn-primary');
    }
    public async cancel(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.btn-default');
    }
}

export class Connect {
    protected selector = '.provider-approval-container';
    public async next(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.btn-confirm');
    }
    public async cancel(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.btn-default');
    }
}

export class Transaction {
    protected selector = '.confirm-page-container-content';
    public async next(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.btn-confirm');
    }
    public async cancel(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.btn-default');
    }
}