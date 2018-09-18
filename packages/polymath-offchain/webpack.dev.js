const merge = require('webpack-merge');
const base = require('../../config/webpack.dev');

module.exports = merge(base, {
  target: 'web',
  watch: true,
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
