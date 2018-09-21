const base = require('../../config/babel.config.js');

module.exports = {
  babelrcRoots: ['../packages/*'],
  presets: ['react-app'],
  plugins: [
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    'react-hot-loader/babel',
    base.moduleResolver,
  ],
};
