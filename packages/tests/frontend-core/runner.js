process.env.TS_NODE_TRANSPILE_ONLY = true;
let appPath = __dirname;
require('app-module-path').addPath(appPath);
let tsconfig = require(`${appPath}/tsconfig.json`);
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: tsconfig.compilerOptions,
});
require('tsconfig-paths').register({
  baseUrl: tsconfig.compilerOptions.baseUrl,
  paths: tsconfig.compilerOptions.paths,
});
require('./runner.ts');
