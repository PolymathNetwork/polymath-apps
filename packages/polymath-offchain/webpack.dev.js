const merge = require('webpack-merge');
const base = require('../../config/webpack.dev');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.local' });
dotenv.config();

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
