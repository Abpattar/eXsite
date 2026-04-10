import { chromium } from 'playwright';
import { delay } from '../utils/delay.js';

export async function runAmazonBot(product) {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        storageState: 'auth.json' // saved login
    });

    const page = await context.newPage();

    try {
        await page.goto(product.url);

        await delay(2000);

        // Click Buy Now
        await page.click('#buy-now-button');

        await delay(3000);

        // NOTE: Payment & OTP may stop here
        console.log("Reached checkout for:", product.name);

        return {
            success: true,
            message: "Checkout reached"
        };

    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    } finally {
        await browser.close();
    }
}