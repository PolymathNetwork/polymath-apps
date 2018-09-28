import { css } from 'docz-plugin-css';

export default {
  title: 'PolymathUI',
  description: 'This is my awesome documentation',
  files: '**/*.{md,mdx}',
  // TODO @grsmto: we can't include this wrapper before it imports some polymath-js dependencies that break Docz build. Need to investigate why this is happening.
  // wrapper: 'src/components/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
  ],
};
