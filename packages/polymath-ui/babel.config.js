const base = require('../../config/babel.config.js');

module.exports = {
  presets: ['react-app'],
  plugins: [
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    base.moduleResolver,
  ],
};
