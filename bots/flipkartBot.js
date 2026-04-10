import { chromium } from 'playwright';
import { delay } from '../utils/delay.js';

export async function runFlipkartBot(product) {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        storageState: 'auth.json'
    });

    const page = await context.newPage();

    try {
        await page.goto(product.url);

        await delay(2000);

        // Flipkart Buy Now button
        await page.click('text=BUY NOW');

        await delay(3000);

        console.log("Flipkart checkout reached");

        return { success: true };

    } catch (err) {
        return { success: false, message: err.message };
    } finally {
        await browser.close();
    }
}