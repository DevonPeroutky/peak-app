const path = require('path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

function srcPaths(src) {
  return path.join(__dirname, src);
}

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(svg|ico|icns)$/,
  loader: "file-loader",
  options: {
    esModule: false,
    name: "[path][name].[hash].[ext]",
    publicPath: "..", // move up from 'main_window'
    context: "src", // set relative working folder to src
  },
});

module.exports = {
  module: {
    rules,
  },
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'source-map',
  plugins: plugins,
  resolve: {
    alias: {
      '@main': srcPaths('electron'),
      '@models': srcPaths('src/models'),
      '@renderer': srcPaths('src/renderer'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};
