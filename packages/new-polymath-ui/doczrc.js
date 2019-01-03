import path from 'path';
import { css } from 'docz-plugin-css';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

export default {
  title: 'PolymathUI',
  description: 'Polymath design system and React components library',
  files: '**/*.{md,mdx}',
  typescript: true,
  wrapper: 'src/docz/DoczWrapper',
  themeConfig: {
    showPlaygroundEditor: true,
  },
  plugins: [
    css({
      preprocessor: 'postcss',
    }),
    css({
      preprocessor: 'sass',
    }),
  ],
  // Hack to get Docz to compile monorepo package
  modifyBundlerConfig: config => {
    config.module.rules[1].include.push(
      path.join(__dirname, '..', 'new-polymath-shared')
    );

    config.resolve.plugins = [
      new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
    ];

    return config;
  },
};
