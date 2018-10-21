require('@babel/register')({
  cwd: `${__dirname}`,
  configFile: `${__dirname}/../../config/babel.config.dev.js`,
  ignore: [/node_modules/],
});
