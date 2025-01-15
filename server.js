import { createServer } from 'http';
import { parse } from 'url';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const port = process.env.PORT || 3000;

const getAppVersions = async (bundleId) => {
  if (!bundleId || typeof bundleId !== 'string') {
    return { error: 'Invalid or missing bundleId' };
  }

  const results = {};

  // Fetch Android version
  try {
    console.log(`[INFO] Fetching Android app version for bundleId: ${bundleId}`);
    const androidApp = await gplay.app({ appId: bundleId });
    results.androidVersion = androidApp.version;
  } catch (error) {
    console.error(`[ERROR] Failed to fetch Android app version for ${bundleId}:`, error.message);
    results.androidVersionError = error.message;
  }

  // Fetch iOS version
  try {
    console.log(`[INFO] Fetching iOS app version for bundleId: ${bundleId}`);
    const iosResults = await store.search({ term: bundleId, num: 1 });
    if (iosResults.length > 0) {
      const iosApp = iosResults[0];
      results.iosVersion = iosApp.version;
    } else {
      throw new Error('No matching iOS app found');
    }
  } catch (error) {
    console.error(`[ERROR] Failed to fetch iOS app version for ${bundleId}:`, error.message);
    results.iosVersionError = error.message;
  }

  return results;
};

const requestHandler = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const bundleId = parsedUrl.query.bundleId;

  console.log(`[DEBUG] Request received: bundleId=${bundleId}`);

  if (path === '/app-versions' && bundleId) {
    const versions = await getAppVersions(bundleId);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ bundleId, ...versions }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request. Please provide bundleId.' }));
  }
};

// Export the server handler for Vercel
export default (req, res) => {
  requestHandler(req, res);
};

// Start server locally if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  createServer(requestHandler).listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
