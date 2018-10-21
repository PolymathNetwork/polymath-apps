/**
 * Resolves imports between namespace packages
 * from `package-name/*` to `package-name/src/*`
 * This allows importing source files between packages without requiring
 * them to be already compiled
 */
const moduleResolverPlugin = [
  'module-resolver',
  {
    // root: ['./src'],
    alias: {
      /* Resolve local dependencies to the corresponding directory */
      '^@polymathnetwork/([^/]+)/(.+)': `@polymathnetwork/\\1/src/\\2`,
      '^@polymathnetwork/(.+)$': '@polymathnetwork/\\1/src',
      /* Consider package.json as special case */
      '^@polymathnetwork/([^/]+)/package.json':
        '@polymathnetwork/\\1/package.json',
      /* TODO @RafaelVidaurre: See if this is necessary */
      '^@polymathnetwork/(.+)': '@polymathnetwork/\\1',
    },
  },
];

/**
 * NOTE @monitz87: __dirname is necessary here because of
 * a bug in babel (see https://github.com/babel/babel/issues/8909)
 */
module.exports = api => {
  console.log('Loading root dev config');
  api.cache(true);
  return {
    babelrcRoots: [__dirname, `${__dirname}/../packages/*`],
    plugins: [
      '@babel/proposal-export-default-from',
      '@babel/proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      moduleResolverPlugin,
    ],
  };
};
