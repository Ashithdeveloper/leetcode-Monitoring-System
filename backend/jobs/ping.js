import cron from 'node-cron';
import https from 'https';
import http from 'http';

/**
 * Keep-alive ping job to prevent free tier services from sleeping
 */
const startPingJob = () => {
  // Run every 14 minutes
  cron.schedule('*/14 * * * *', () => {
    const url = process.env.API_URL;

    if (!url) {
      console.error("[Ping Job] API_URL is not defined in env. Skipping ping.");
      return;
    }

    console.log(`[Ping Job] Sending keep-alive ping to ${url}...`);

    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (res) => {
        console.log(`[Ping Job] Ping to ${url} status: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error("[Ping Job] Error while sending ping:", err.message);
      });
  });

  console.log('Keep-alive ping job scheduled (Runs every 14 mins)');
};

export default startPingJob;
