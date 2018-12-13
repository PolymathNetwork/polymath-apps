const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('../webpack.config');

module.exports = function() {
  return {
    compress: true,
    contentBase: '/public',
    watchContentBase: true,
    hot: true,
    publicPath: '/',
    port: process.env.PORT,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    before(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
