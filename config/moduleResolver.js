/**
 * Resolves imports between namespace packages
 * from `package-name/*` to `package-name/{mainDir}/*`
 * This allows importing files between packages from the package root
 *
 * @param {string} mainDir package entry point (can be 'src' or 'build' depending on the package requirements)
 *
 * Packages built with webpack will want to use 'src' for everything, while packages built with babel will want 'src'
 * for development and 'build' for production builds.
 */
module.exports = mainDir => {
  return [
    'module-resolver',
    {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      root: [`./src`],
      cwd: 'packagejson',
      alias: {
        '~/(.+)': `./src`,
        /* Resolve local dependencies to the corresponding directory */
        '^@polymathnetwork/([^/]+)/(.+)': `@polymathnetwork/\\1/${mainDir}/\\2`,
        '^@polymathnetwork/(.+)$': `@polymathnetwork/\\1/${mainDir}`,
        /* Consider package.json as special case */
        '^@polymathnetwork/([^/]+)/package.json':
          '@polymathnetwork/\\1/package.json',
        /* TODO @RafaelVidaurre: See if this is necessary */
        '^@polymathnetwork/(.+)': '@polymathnetwork/\\1',
      },
    },
  ];
};
