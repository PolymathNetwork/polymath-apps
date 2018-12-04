const instrumentForCodeCoverage = process.env.COVERAGE === 'true';
const moduleResolver = require('./config/moduleResolver');

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
module.exports = {
  babelrcRoots: [__dirname, `${__dirname}/packages/*`],
  // babelrcRoots: [__dirname, ]
  plugins: [
    '@babel/proposal-export-default-from',
    '@babel/proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    moduleResolver('src'),
    ...(instrumentForCodeCoverage ? [istanbulPlugin] : []),
  ],
};
