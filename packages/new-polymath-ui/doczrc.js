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
};
