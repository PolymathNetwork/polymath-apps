// Transform imports into empty objects (Used for css and other formats irrelevant to tests)
module.exports = {
  process(filename) {
    return 'module.exports = {};';
  },
  getCacheKey() {
    return 'cssTransform';
  },
};
