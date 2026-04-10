import { getPendingJobs, updateJobStatus, createOrderLog } from '../services/jobService.js';
import { getProduct } from '../services/productService.js';
import { runAmazonBot } from '../bots/amazonBot.js';
import { runFlipkartBot } from '../bots/flipkartBot.js';

async function processJobs() {
    console.log("Checking for jobs...");

    const jobs = await getPendingJobs();

    for (const job of jobs) {
        console.log("Processing job:", job.id);

        await updateJobStatus(job.id, 'running');

        try {
            const product = await getProduct(job.product_id);

            let result;

            if (product.platform === 'amazon') {
                result = await runAmazonBot(product);
            } else if (product.platform === 'flipkart') {
                result = await runFlipkartBot(product);
            }

            await createOrderLog({
                product_id: product.id,
                status: result.success ? 'success' : 'failed',
                response_log: result.message || ''
            });

            await updateJobStatus(job.id, result.success ? 'success' : 'failed');

        } catch (err) {
            console.error(err);
            await updateJobStatus(job.id, 'failed');
        }
    }
}

setInterval(processJobs, 10000); // every 10 sec