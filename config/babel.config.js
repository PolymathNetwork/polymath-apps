module.exports = {
  moduleResolver: [
    'module-resolver',
    {
      root: ['./src'],
      alias: {
        /* Requirements */
        '^@polymathnetwork/([^/]+)/build/(.+)':
          '@polymathnetwork/\\1/build/\\2',
        /* Resolve local dependencies to their src directory */
        '^@polymathnetwork/([^/]+)/(.+)': '@polymathnetwork/\\1/src/\\2',
        '^@polymathnetwork/(.+)$': '@polymathnetwork/\\1/src',
        /* Consider package.json as special case */
        '^@polymathnetwork/([^/]+)/package.json':
          '@polymathnetwork/\\1/package.json',
        /* TODO @RafaelVidaurre: See if this is necessary */
        '^@polymathnetwork/(.+)': '@polymathnetwork/\\1',
      },
    },
  ],
};
