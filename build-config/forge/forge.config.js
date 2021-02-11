const { notarize } = require('electron-notarize');
const path = require('path');

module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'peak_app',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    packagerConfig: {
        asar: true,
        "protocols": [{"name": "Peak", "schemes": ["peak-dev-app", "peak-app"]}],
        "name": "Peak",
        "executableName": "Peak",
        "dmg": {
            "sign": false,
        },
        "osxSign": {
            "identity": process.env.APPLE_DEVELOPER_IDENTITY,
            "hardenedRuntime": true,
            "gatekeeper-assess": false,
            "entitlements": "./build-dependencies/resources/entitlements.mac.plist",
            "entitlementsInherits": "./build-dependencies/resources/entitlements.mac.plist"
        },
        "osxNotarize": {
            "appleId": process.env.APPLE_ID,
            "appleIdPassword": process.env.APPLE_ID_PASSWORD
        },
        "icon": "./src/assets/logos/electron-icons/mac/icon.icns",
        packageManager: 'yarn'
    },
    "hooks": {
        "postPackage": async function (params) {
            console.log('postPackage hook triggered');

            if (process.platform !== 'darwin') {
                console.log('Skipping notarization - not building for Mac');
                return;
            }

            await notarize({
                // appBundleId: "com.massive.peak",
                appPath: path.join("out", "Peak-darwin-x64", "Peak.app"),
                appleId: process.env.APPLE_ID,
                appleIdPassword: process.env.APPLE_ID_PASSWORD
            });
        }
    },
    "plugins": [
        [
            "@electron-forge/plugin-webpack",
            {
                "mainConfig": "./build-config/webpack/webpack.main.config.js",
                "renderer": {
                    "config": "./build-config/webpack/webpack.renderer.config.js",
                    "entryPoints": [
                        {
                            "html": "./public/index.html",
                            "js": "./src/renderer.tsx",
                            "name": "main_window"
                        }
                    ]
                }
            }
        ],
    ],
    "publishers": [
        {
            "name": "@electron-forge/publisher-github",
            "config": {
                "repository": {
                    "owner": "DevonPeroutky",
                    "name": "peak-app"
                }
            }
        }
    ],
    "dependencies": {
        "electron-squirrel-startup": "^1.0.0"
    },
    "devDependencies": {
        "@electron-forge/cli": "^6.0.0-beta.54",
        "@electron-forge/maker-deb": "^6.0.0-beta.54",
        "@electron-forge/maker-rpm": "^6.0.0-beta.54",
        "@electron-forge/maker-squirrel": "^6.0.0-beta.54",
        "@electron-forge/maker-zip": "^6.0.0-beta.54",
        "@electron-forge/publisher-github": "^6.0.0-beta.54",
        "electron": "11.1.1"
    }
};