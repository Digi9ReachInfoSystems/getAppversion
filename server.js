import { createServer } from 'http';
import { parse } from 'url';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const port = process.env.PORT || 3000;

const getAppVersion = async (appId, platform) => {
  if (!appId || typeof appId !== 'string') {
    return { error: 'Invalid or missing appId' };
  }

  try {
    if (platform === 'android') {
      console.log(`[INFO] Fetching Android app version for appId: ${appId}`);
      const app = await gplay.app({ appId });

      if (app && app.version) {
        return { appId, platform, version: app.version };
      } else {
        throw new Error('Android app details could not be fetched');
      }
    } else if (platform === 'ios') {
      console.log(`[INFO] Fetching iOS app version for appId: ${appId}`);
      const app = await store.app({ id: appId });

      if (app && app.version) {
        return { appId, platform, version: app.version };
      } else {
        throw new Error('iOS app details could not be fetched');
      }
    } else {
      throw new Error('Invalid platform. Please specify either "android" or "ios".');
    }
  } catch (error) {
    console.error(`[ERROR] Failed to get the app version for ${appId} on ${platform}:`, error.message);
    return { error: error.message };
  }
};

const requestHandler = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const appId = parsedUrl.query.appId;
  const platform = parsedUrl.query.platform; // Expecting 'android' or 'ios'

  if (path === '/app-version' && appId && platform) {
    const result = await getAppVersion(appId, platform);

    if (result.error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch app version', details: result.error }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request. Please provide appId and platform (android/ios).' }));
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
