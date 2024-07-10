import { createServer } from 'http';
import { parse } from 'url';
import gplay from 'google-play-scraper';

const port = process.env.PORT || 3000;

const requestHandler = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const appId = parsedUrl.query.appId;

  if (path === '/app-version' && appId) {
    try {
      console.log(`Fetching app version for appId: ${appId}`);
      const app = await gplay.app({ appId });
      const version = app.version;
      console.log(`Fetched version ${version} for appId: ${appId}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ appId, version }));
    } catch (error) {
      console.error(`Failed to get the app version for ${appId}:`, error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get the app version', details: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
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
