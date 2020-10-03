const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);
module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      'style-loader',
      // Translates CSS into CommonJS
      'css-loader',
      // Compiles Sass to CSS
      'sass-loader',
    ],
  },
  {
    test: /\.(svg|ico|icns)$/,
    loader: "file-loader",
    options: {
      esModule: false,
      name: "[path][name].[hash].[ext]",
    },
  },
  // {
  //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/, /\.woff$/, /\.woff2$/],
  //   loader: require.resolve('url-loader'),
  //   options: {
  //     limit: imageInlineSizeLimit,
  //     name: 'static/media/[name].[ext]',
  //   },
  // },
  {
    test: /\.(jpg|png|woff|woff2|eot|ttf)$/,
    loader: "url-loader",
    options: {
      name: "[path][name].[ext]",
    },
  }
];
