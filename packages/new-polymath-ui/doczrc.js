import { set } from 'lodash';
import { css } from 'docz-plugin-css';

export default {
  title: 'PolymathUI',
  description: 'Polymath design system and React components library',
  files: '**/*.{md,mdx}',
  typescript: true,
  wrapper: 'src/docz/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'postcss',
    }),
    css({
      preprocessor: 'sass',
    }),
  ],
  modifyBundlerConfig: config => {
    const jsxPluginIndex = config.plugins.findIndex(
      plugin => plugin.config.id === 'jsx'
    );
    const { loaders } = config.plugins[jsxPluginIndex].config;
    const docGenLoaderIndex = loaders.findIndex(loader =>
      /react-docgen-typescript-loader/.test(loader.loader)
    );
    const docGenLoader = loaders[docGenLoaderIndex];

    set(docGenLoader, 'options.propFilter', prop => {
      if (prop.parent == null) {
        return true;
      }

      // Filter out props which type definition is placed in react package
      return prop.parent.fileName.indexOf('node_modules/@types/react') < 0;
    });

    set(docGenLoader, 'options.tsconfigPath', './tsconfig.json');

    return config;
  },
};
