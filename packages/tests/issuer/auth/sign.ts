import { t } from 'testcafe';
import { Metamask } from '@poly/tests-frontend-core/metamask';
import { Puppeteer } from '@poly/tests-frontend-core/browser/puppeteer';

const metamaskLogin = async function () {
    await Puppeteer.init();
    // MM already opens a window for us
    await Puppeteer.closeOthers("localhost");
    await Metamask.instance
        // Default secret from ganache
        .navigateToPage()
        .then(m => m.importAccount("candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", "test1234"))
        .then(m => m.acceptTerms())
        .then(m => m.exitPage());
};

const baseUrl: string = process.env.URL || 'https://betastudio.polymath.network';

fixture("Authentication")
    .page`about:blank`

test("Sign successfully", async t => {
    await t.navigateTo(baseUrl);
    await metamaskLogin();
    await t.click('#create-token-btn');
    await Metamask.instance.navigateToPage().
        then(m => m.sign());
})

test("Reject sign in", async t => {
    await t.navigateTo(baseUrl);
    await metamaskLogin();
    await t.click('#create-token-btn');
    await Metamask.instance.navigateToPage().
        then(m => m.sign({ cancel: true }));
})