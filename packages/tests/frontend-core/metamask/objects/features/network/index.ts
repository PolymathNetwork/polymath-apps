import { Network } from "../../../shared";
import { page } from "../../../../browser/puppeteer";

export class NetworkManager {
    protected selector = '.network-component-wrapper';
    public async next(network: Network): Promise<void> {
        await page.click(this.selector);
        let selector = `.//*[contains(@class, "") and text(${Network[network]})]`;
        await page.waitForSelector(selector);
        await page.click(selector);
        await page.waitFor(1000);
        // Some networks are marked as 'Private' and this breaks our locator
    }
}