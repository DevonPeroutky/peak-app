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
    "packagerConfig": {
        protocols: [{"name": "Peak", "schemes": ["peak-dev-app", "peak-app"]}],
        name: "Peak",
        executableName: "Peak",
        "icon": "./src/assets/logos/electron-icons/mac/icon.icns"
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