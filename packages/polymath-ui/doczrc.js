import { css } from 'docz-plugin-css';

export default {
  title: 'PolymathUI',
  description: 'Polymath design system and React components library',
  files: '**/*.{md,mdx}',
  wrapper: 'src/components/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
  ],
};
