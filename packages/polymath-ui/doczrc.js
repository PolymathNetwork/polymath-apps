import { css } from 'docz-plugin-css';

export default {
  title: 'PolymathUI',
  description: 'This is my awesome documentation',
  files: '**/*.{md,mdx}',
  wrapper: 'src/components/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
  ],
};
