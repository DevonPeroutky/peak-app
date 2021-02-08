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
    ]
};