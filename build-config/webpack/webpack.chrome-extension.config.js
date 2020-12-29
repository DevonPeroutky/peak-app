// OG config was based off: https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate
const webpack = require("webpack");
const path = require("path");
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
    test: /\.svg$/,
    use: "file-loader",
})

const config = {
    entry: {
        content: path.join(__dirname, "../../src/chrome-extension/content-script/content.tsx"),
        background: path.join(__dirname, "../../src/chrome-extension/background/background.ts"),
    },
    module: { rules },
    resolve: {
        modules: ['../../node_modules', './node_modules'],
        extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    devServer: {
        contentBase: "../../dist",
    },
    devtool: 'cheap-module-source-map',
    plugins: plugins,
};

module.exports = config;