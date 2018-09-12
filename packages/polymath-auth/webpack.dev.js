const merge = require('webpack-merge');
const base = require('../../config/webpack.dev');
const dotenv = require('dotenv');

dotenv.config({ path: './env.local' });
dotenv.config();

module.exports = merge(base, {
  devServer: {
    contentBase: './dist',
    port: process.env.PORT,
  },
  target: 'web',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
