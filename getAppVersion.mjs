import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

export async function getAppVersion(appId, platform) {
  if (!appId || typeof appId !== 'string') {
    console.error('Invalid or missing appId. Please provide a valid app ID.');
    return null;
  }

  try {
    if (platform === 'android') {
      console.log(`[INFO] Fetching Android app version for appId: ${appId}`);
      const app = await gplay.app({ appId });

      if (app && app.version) {
        console.log(`[SUCCESS] The latest Android version of the app (${appId}) is: ${app.version}`);
        return app.version;
      } else {
        throw new Error('Android app details could not be fetched');
      }
    } else if (platform === 'ios') {
      console.log(`[INFO] Fetching iOS app version for appId: ${appId}`);
      const app = await store.app({ id: appId });

      if (app && app.version) {
        console.log(`[SUCCESS] The latest iOS version of the app (${appId}) is: ${app.version}`);
        return app.version;
      } else {
        throw new Error('iOS app details could not be fetched');
      }
    } else {
      throw new Error('Invalid platform. Please specify either "android" or "ios".');
    }
  } catch (error) {
    console.error(`[ERROR] Failed to get the app version for ${appId} on ${platform}:`, error.message);
    return null;
  }
}

// Replace these app IDs with the actual app IDs for Android and iOS
const androidAppId = process.env.ANDROID_APP_ID || 'com.digi9.edvt';
const iosAppId = process.env.IOS_APP_ID || 'id123456789'; // Replace with actual iOS app ID

(async () => {
  const androidVersion = await getAppVersion(androidAppId, 'android');
  const iosVersion = await getAppVersion(iosAppId, 'ios');

  console.log(`The Android version of the app (${androidAppId}) is: ${androidVersion}`);
  console.log(`The iOS version of the app (${iosAppId}) is: ${iosVersion}`);
})();
