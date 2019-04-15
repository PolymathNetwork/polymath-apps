import { connect, Browser, Page } from 'puppeteer';

export class Puppeteer {
    public static _browser: Browser;
    public static get browser() {
        return this._browser;
    }
    public static set browser(browser: Browser) {
        this._browser = browser;
    }
    private static _currentPage: Page;
    public static get currentPage() {
        return this._currentPage;
    }
    public static set currentPage(page: Page) {
        this._currentPage = page;
    }
    public static async setCurrentPage(index?: number) {
        let pages = await this.browser.pages();
        this.currentPage = pages[index === undefined ? pages.length - 1 : index];
        await this.currentPage.bringToFront();
    }
    public static async closeOthers(title: string) {
        let pages = await this.browser.pages();
        if (pages.length > 1) for (let i = 0; i < pages.length; ++i) {
            let pageTitle = await pages[i].url();
            if (pageTitle.indexOf(title) === -1)
                await pages[i].close();
        }
        this.currentPage = await this.browser.pages[0];
    }
    public static async init(url: string = `http://localhost:${process.env.PORT || "9222"}`) {
        this.browser = await connect({ browserURL: url });
        let pages = await this.browser.pages();
        this.currentPage = pages[pages.length - 1];
    }
}

export let browser: Browser;
export let page: Page;
module.exports = {
    ...module.exports,
    get page() {
        return Puppeteer.currentPage;
    },
    get browser() { return Puppeteer.browser; }
}