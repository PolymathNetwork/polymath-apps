import { page } from "../../../../browser/puppeteer";
import { Locked } from "../locked";

export abstract class TermsAndConditions {
    protected async scrollToEnd() {
        await page.waitForSelector('div[class*="markdown"]');
        await page.$eval('div[class*="markdown"]', e => {
            e.scroll(0, e.scrollHeight);
        });
    }
}

export class WelcomeMetamaskBeta extends TermsAndConditions {
    protected selector = '.welcome-page__wrapper';
    public async next(): Promise<Locked> {
        await page.waitForSelector(this.selector);
        await page.click('button');
        return new Locked();
    }
}

export class Terms extends TermsAndConditions {
    protected featureSelector = '.first-time-flow__markdown';
    public async next(): Promise<void> {
        await this.scrollToEnd();
        await page.waitFor(1000);
        await page.click('button');
    }
}