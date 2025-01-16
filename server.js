import { createServer } from 'http';
import { parse } from 'url';
import { getIOSAppVersion } from './getIOSAppVersion.js'; // Import iOS version function
import gplay from 'google-play-scraper'; // Import Google Play scraper

const port = process.env.PORT || 3000;

// Request handler function
const requestHandler = async (req, res) => {
    const parsedUrl = parse(req.url, true); // Parse the incoming URL
    const path = parsedUrl.pathname;
    const { appId, platform } = parsedUrl.query; // Extract query parameters

    // Check if the request is for the /app-version endpoint
    if (path === '/app-version') {
        // Validate query parameters
        if (!appId || !platform) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(
                JSON.stringify({
                    error: 'Missing required query parameters: appId and platform',
                })
            );
        }

        try {
            let version;

            if (platform === 'ios') {
                // Fetch version from iOS App Store
                version = await getIOSAppVersion(appId);
            } else if (platform === 'android') {
                // Fetch version from Google Play Store
                const app = await gplay.app({ appId });
                version = app.version;
            } else {
                // Unsupported platform
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(
                    JSON.stringify({
                        error: 'Invalid platform. Supported values are "ios" or "android".',
                    })
                );
            }

            // Respond with the app version
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
                JSON.stringify({
                    appId,
                    platform,
                    version,
                })
            );
        } catch (error) {
            console.error(`Error fetching app version for appId: ${appId}`, error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(
                JSON.stringify({
                    error: 'Failed to fetch app version',
                    details: error.message,
                })
            );
        }
    }

    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            error: 'Not Found',
        })
    );
};

// Start the server
createServer(requestHandler).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
