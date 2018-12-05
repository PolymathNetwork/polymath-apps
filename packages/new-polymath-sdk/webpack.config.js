const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    path.resolve(__dirname, './src/index.tsx'),
  ],
  context: path.resolve(__dirname, '../'),
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // {
          //   test: /\.(js|jsx|mjs)$/,
          //   loader: require.resolve('source-map-loader'),
          //   enforce: 'pre',
          //   include: 'src',
          // },
          // {
          //   test: /\.tsx?$/,
          //   loader: 'ts-loader',
          //   options: {
          //     compiler: 'ttypescript',
          //   },
          //   exclude: /node_modules/,
          // },
          {
            test: /\.tsx?$/,
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin(),
      new DeclarationBundlerPlugin({
        moduleName: '@polymathnetwork/polymath-sdk',
      }),
    ],
    // alias: {
    // Aliases would go here
    // },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  output: {
    pathinfo: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/dist'),
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
};
