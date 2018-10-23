/**
  NOTE @monitz87: this wrapper is required because jest does not 
  fully support babel 7.0, and this is the only way of passing rootMode
  as an option for babel-jest to pick up the root config when transpiling
  modules for testing
 */
module.exports = require('babel-jest').createTransformer({
  rootMode: 'upward',
});
