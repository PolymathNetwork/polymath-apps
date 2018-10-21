const instrumentForCodeCoverage = process.env.COVERAGE === 'true';

/**
 * Resolves imports between namespace packages
 * from `package-name/*` to `package-name/build/*`
 * This allows importing everything from the package root
 */
const moduleResolverPlugin = [
  'module-resolver',
  {
    // root: ['./build'],
    alias: {
      /* Resolve local dependencies to the corresponding directory */
      '^@polymathnetwork/([^/]+)/(.+)': `@polymathnetwork/\\1/build/\\2`,
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
 * Used by e2e tests. Instruments the code to expose coverage
 * info to the browser
 */
const istanbulPlugin = [
  'istanbul',
  {
    exclude: '**/__tests__/**/*',
    useInlineSourceMaps: false,
  },
];

/**
 * NOTE @monitz87: __dirname is necessary here because of
 * a bug in babel (see https://github.com/babel/babel/issues/8909)
 */
module.exports = api => {
  console.log('Loading root production config');
  api.cache(true);
  return {
    babelrcRoots: [__dirname, `${__dirname}/../packages/*`],
    plugins: [
      '@babel/proposal-export-default-from',
      '@babel/proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      moduleResolverPlugin,
      ...(instrumentForCodeCoverage ? [istanbulPlugin] : []),
    ],
  };
};
