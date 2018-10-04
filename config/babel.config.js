const instrumentForCodeCoverage = process.env.COVERAGE === 'true';

/**
 * Resolves imports between namespace packages
 * from `package-name/*` to `package-name/src/*`
 * This allows importing source files between packages without requiring
 * them to be already compiled
 */
const moduleResolverPlugin = [
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      /* Avoid resolving to "src" when importing "build" directory */
      '^@polymathnetwork/([^/]+)/build/(.+)': '@polymathnetwork/\\1/build/\\2',
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

module.exports = {
  plugins: [
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    moduleResolverPlugin,
    ...(instrumentForCodeCoverage ? [istanbulPlugin] : []),
  ],
};
