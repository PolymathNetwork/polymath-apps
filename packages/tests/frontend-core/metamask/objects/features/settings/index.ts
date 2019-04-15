import { AccountManager } from "../account";
import { Locked } from "../../pages/locked";
import { page } from "../../../../browser/puppeteer";


export class Settings {
    protected featureSelector = '.account-menu__icon';
    public async lock(): Promise<Locked> {
        await new AccountManager().waitForMenu();
        await page.click('.account-menu__logout-button');
        return new Locked();
    }
    public async settings(): Promise<SettingsPage> {
        await new AccountManager().waitForMenu();
        await page.click('.//*[contains(@class,"menu__item--clickable div") and text()="Settings"');
        return new SettingsPage();
    }
}

export class ConfirmationDialog {
    public selector = '.modal';
    public async next() {
        await page.waitForSelector(this.selector);
        await page.click('.btn-default');
    }
    public async cancel() {
        await page.waitForSelector(this.selector);
        await page.click('.btn-secondary');
    }
}

export class SettingsPage {
    protected selector = '.main-container.settings';
    public customRpc = '#new-rpc';
    public privacyMode = './/span[text()="Privacy Mode"]';
    public async set({ customRpc, privacyMode }) {
        await page.waitForSelector(this.selector);
        if (customRpc !== undefined) await page.type(this.customRpc, customRpc);
        if (privacyMode !== undefined
            && (privacyMode && 1) ^ (
                await (await (await page.$(this.privacyMode)).getProperty('checked')).jsonValue() && 1)) {
            await page.click(this.privacyMode);
        }
    }
    public async next(): Promise<void> {
        await page.waitForSelector(this.selector);
        await page.click('.rpc-save-button');
    }
    public async close(): Promise<void> {
        await page.waitForSelector(this.selector);
        // Metamask screwed up the close button...
        await page.click('.app-header__metafox-logo--horizontal');
    }
    public async reset(): Promise<this> {
        await page.waitForSelector(this.selector);
        await page.click('.//*[contains(@class,"settings-tab__button--orange") and text()="Reset Account"]');
        let dialog = new ConfirmationDialog();
        await dialog.next();
        return this;
    }
    public async clearPrivacy(): Promise<this> {
        await page.waitForSelector(this.selector);
        await page.click('.//*[contains(@class,"settings-tab__button--orange") and text()="Clear Privacy Data"]');
        let dialog = await new ConfirmationDialog();
        await dialog.next();
        return this;
    }
}