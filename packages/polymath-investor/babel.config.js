const base = require('../../config/babel.config.js');

module.exports = {
  babelrcRoots: ['../packages/*'],
  presets: ['react-app'],
  plugins: [...base.plugins],
};
