import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

export async function getAppVersions(bundleId) {
  if (!bundleId || typeof bundleId !== 'string') {
    console.error('[ERROR] Invalid or missing bundleId');
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
}

// Replace with your test bundle ID
const bundleId = process.env.BUNDLE_ID || 'com.facebook.katana';

getAppVersions(bundleId).then((versions) => {
  console.log(`[RESULT] Versions for bundleId ${bundleId}:`, versions);
}).catch((error) => {
  console.error('[ERROR] An error occurred while fetching app versions:', error.message);
});
