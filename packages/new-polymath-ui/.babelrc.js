module.exports = {
  presets: ['@babel/typescript', '@babel/react'],
  plugins: [
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack![path]',
          },
        },
      },
    ],
  ],
};
