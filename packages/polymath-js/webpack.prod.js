const merge = require('webpack-merge');
const base = require('../../config/webpack.prod');

const path = require('path');
module.exports = merge(base, {
  output: {
    path: path.join(__dirname, 'build'),
  },
});
