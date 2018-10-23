const moduleResolver = require('../../config/moduleResolver.js');
require('@babel/register')({
  cwd: `${__dirname}`,
  rootMode: 'upward',
  overrides: [
    {
      plugins: [moduleResolver('src')],
    },
  ],
  ignore: [/node_modules/],
});
