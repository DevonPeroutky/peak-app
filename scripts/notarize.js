require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    console.log(`Notarizing!!`)
    const { electronPlatformName, appOutDir } = context;

    if (process.env.DEV_ONLY) {
        console.log(`DEV_ONLY, skipping notarization`);
        return;
    }

    if (electronPlatformName !== 'darwin') {
        console.log('Skipping notarization - not building for Mac');
        return;
    }

    if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
        console.warn(
            'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
        );
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appBundleId: 'com.massive.peak',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
    });
};