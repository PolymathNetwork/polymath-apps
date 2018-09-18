const merge = require('webpack-merge');
const path = require('path');
const base = require('../../config/webpack.prod');

module.exports = merge(base, {
  output: {
    path: path.join(__dirname, 'build'),
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
