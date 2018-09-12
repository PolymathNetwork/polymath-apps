const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'main.js',
  },
  mode: 'production',
  devtool: 'source-map',
});
