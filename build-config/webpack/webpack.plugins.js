const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyWebpackPlugin(
      {
          patterns: [
              { from: path.join("src", "assets"), to: "assets" },
              { from: "public", to: "." }
          ]
      }
  )
];
