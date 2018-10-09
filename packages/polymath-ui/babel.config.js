const base = require('../../config/babel.config.js');

module.exports = {
  babelrcRoots: ['../packages/*'],
  presets: ['@babel/env', '@babel/flow', '@babel/react'],
  plugins: [...base.plugins, '@babel/plugin-transform-runtime'],
};
