module.exports = {
  moduleResolver: [
    'module-resolver',
    {
      root: ['./src'],
      alias: {
        '^@polymathnetwork/([^/]+)/(.+)': '@polymathnetwork/\\1/src/\\2',
        '^@polymathnetwork/(.+)$': '@polymathnetwork/\\1/src',
        '^@polymathnetwork/(.+)': '@polymathnetwork/\\1',
        '^@polymathnetwork/([^/]+)/package.json':
          '@polymathnetwork/\\1/package.json',
      },
    },
  ],
};
