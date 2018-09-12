const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    app: './src/index.js',
  },
  devServer: {
    contentBase: './dist',
  },
  mode: 'development',
  devtool: 'inline-source-map',
});
