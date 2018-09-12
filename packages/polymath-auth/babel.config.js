const base = require('../../config/babel.config.js');
module.exports = {
  babelrcRoots: ['../packages/*'],
  presets: ['@babel/flow', '@babel/env'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-async-generators',
    '@babel/plugin-transform-regenerator',
    base.moduleResolver,
  ],
};
