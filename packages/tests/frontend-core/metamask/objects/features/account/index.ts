import { Detail } from "../../pages/account/detail";
import { page } from "../../../../browser/puppeteer";

export class AccountCreate {
    protected selector = '.new-account';
    public name = '.new-account-create-form__input';
    public async set({ name }) {
        await page.waitForSelector(this.selector);
        await page.type(this.name, name);
    }
    public async next(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('button.btn-primary');
    }
}

export class AccountManager {
    protected selector = '.account-menu__icon';
    public accounts = '.account-menu__name';
    public async get() {
        await this.waitForMenu();
        let accounts = await page.$$eval(this.accounts, e => e.map(el => el.textContent));
        await page.click('.menu__close-area')
        return accounts;
    }
    public async create(lookForNext: boolean = true, accountCreation: boolean = true): Promise<Detail | void> {
        await this.waitForMenu();
        await this.click('.//*[@class="menu__item__text"][text()="Create Account"]');
        if (accountCreation) {
            return new AccountCreate().next();
        }
        return new Detail();
    }
    public async select(name: string): Promise<Detail> {
        await this.waitForMenu();
        await this.click(`.//*[@class="account-menu__name"][text()="${name}"]`);
        return new Detail();
    }
    public async waitForMenu(): Promise<void> {
        await page.click(this.selector);
        await page.waitForSelector('.account-menu__accounts');
    }
    public async click(element: string): Promise<void> {
        let dropdown = await page.waitForSelector('.account-menu__accounts');
        await page.$eval(element, e => e.scroll(0, e.scrollTop));
        await page.click(element);
    }
}