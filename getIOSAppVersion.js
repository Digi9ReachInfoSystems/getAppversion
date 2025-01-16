import axios from 'axios';

/**
 * Get the iOS app version from the App Store using a dynamic bundle ID.
 * @param {string} bundleId - The bundle ID of the app (e.g., com.facebook.Facebook).
 * @returns {Promise<string>} - Returns the app version as a string.
 */
export async function getIOSAppVersion(bundleId) {
    if (!bundleId) {
        throw new Error("Bundle ID is required to fetch the iOS app version.");
    }

    try {
        const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}`;
        const response = await axios.get(url);

        if (response.data.resultCount > 0) {
            return response.data.results[0].version;
        } else {
            throw new Error("App not found in the App Store.");
        }
    } catch (error) {
        throw new Error(`Error fetching iOS app version: ${error.message}`);
    }
}
