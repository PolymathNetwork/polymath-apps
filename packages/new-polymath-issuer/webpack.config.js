const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          projectReferences: true,
          compiler: 'ttypescript',
        },
        exclude: /node_modules/,
      },
    ],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
    plugins: [
      new TsconfigPathsPlugin(),
      new DeclarationBundlerPlugin({
        moduleName: '@polymathnetwork/new-issuer',
      }),
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/dist'),
  },
};
