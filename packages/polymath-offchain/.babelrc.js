module.exports = {
  presets: ['@babel/flow', '@babel/env', '@babel/react'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-async-generators',
    '@babel/plugin-transform-regenerator',
  ],
};
