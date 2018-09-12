const merge = require('webpack-merge');
const base = require('../../config/webpack.prod');

module.exports = merge(base, {
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
