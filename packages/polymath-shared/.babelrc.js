module.exports = {
  presets: ['@babel/flow', '@babel/env'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-async-generators',
    '@babel/plugin-transform-regenerator',
  ],
};
