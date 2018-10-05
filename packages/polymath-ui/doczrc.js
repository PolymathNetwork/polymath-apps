import { css } from 'docz-plugin-css';
import doczPluginNetlify from 'docz-plugin-netlify';

export default {
  title: 'PolymathUI',
  description: 'This is my awesome documentation',
  files: '**/*.{md,mdx}',
  dest: 'build',
  wrapper: 'src/components/DoczWrapper',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
    doczPluginNetlify(),
  ],
};
