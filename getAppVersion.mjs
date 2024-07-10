import gplay from 'google-play-scraper';

async function getAppVersion(appId) {
  try {
    // Fetch the app details from the Play Store
    const app = await gplay.app({ appId });
    
    // Get the version of the app
    const version = app.version;

    // Log the app version
    console.log(`The latest version of the app (${appId}) is: ${version}`);
  } catch (error) {
    // Handle errors
    console.error(`Failed to get the app version for ${appId}:`, error);
  }
}

// Replace 'com.digi9.edvt' with the actual app ID of the app you want to check
const appId = 'com.digi9.edvt';

// Get the app version
getAppVersion(appId);
