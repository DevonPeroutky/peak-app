// OG config was based off: https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate
const webpack = require("webpack");
const path = require("path");
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

const chrome_extension_rules = [
    ...rules,
    {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    },
    {
        test: /\.svg$/,
        use: "file-loader",
    }
]

const config = {
    entry: {
        content: path.join(__dirname, "../../src/chrome-extension/content-script/content.tsx"),
        background: path.join(__dirname, "../../src/chrome-extension/background/background.ts"),
    },
    module: {
        rules: chrome_extension_rules
    },
    resolve: {
        modules: ['../../node_modules', './node_modules'],
        extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    devServer: {
        contentBase: "../../extension-dist",
    },
    output: {
        path: path.resolve(__dirname, "../../extension-dist")
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        ...plugins,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('chrome_extension'),
            'process.env.REACT_APP_ENV': JSON.stringify(process.env.REACT_APP_ENV),
            'process.env.REACT_APP_BACKEND_SERVER_ADDRESS': JSON.stringify(process.env.REACT_APP_BACKEND_SERVER_ADDRESS),
            'process.env.REACT_APP_APP_SERVER_ADDRESS': JSON.stringify(process.env.REACT_APP_APP_SERVER_ADDRESS),
        })
    ],
};

module.exports = config;