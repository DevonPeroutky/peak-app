const path = require('path');
const rules = require('./webpack.rules');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/electron/main.ts',
  devtool: 'source-map',
  target: 'electron-main',
  // Put your normal webpack config below here
  module: {
    rules: rules,
  },
  resolve: {
    alias: {
      '@main': srcPaths('electron'),
      '@models': srcPaths('src/models'),
      '@renderer': srcPaths('src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};