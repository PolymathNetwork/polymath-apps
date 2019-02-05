import { css } from 'docz-plugin-css';

export default {
  title: 'Polymath UI',
  description: 'Polymath design system and React components library',
  files: '**/*.{md,mdx}',
  wrapper: 'src/components/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'postcss',
    }),
    css({
      preprocessor: 'sass',
    }),
  ],
};
