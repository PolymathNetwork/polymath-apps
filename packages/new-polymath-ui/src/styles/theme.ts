import { transparentize, darken } from 'polished';
import { types } from '@polymathnetwork/new-shared';
import { Scale } from './types';
import { buttonReset } from './utils';

const breakpoints = {
  sm: 0,
  md: '42.5em', // 680px
  lg: '64em', // 1024px
  xl: '80em', // 1280px
};

const fontSizes: Scale<string> = {
  0: '0.75rem', // 12px
  1: '0.875rem', // 14px
  2: '1rem', // 16px
  3: '1.125rem', // 18px
  4: '1.25rem', // 20px
  5: '1.5rem', // 24px
  6: '1.75rem', // 28px
  7: '2rem', // 32px
  8: '2.25rem', // 36px
  9: '2.625rem', // 42px
};

fontSizes.baseText = fontSizes[1];

const fontFamilies = {
  baseText: "'Overpass', sans-serif",
};

const lineHeights = {
  none: 1,
  tight: 1.15,
  normal: 1.5,
  loose: 2,
};

const fontWeights = {
  light: 300,
  normal: 400,
  bold: 600,
};

const space: Scale<string> = {
  0: '0',
  1: '5px',
  2: '10px',
  3: '16px',
  4: '23px',
  5: '30px',
  6: '48px',
  7: '80px',
  8: '120px',
};

space.s = space[2];
space.m = space[3];
space.l = space[5];
space.xl = space[6];
space.xxl = space[7];
space.xxxl = space[8];

space.gridGap = space[4];

const zIndexes = {
  header: 80,
  sidebar: 100,
};

const colors = {
  baseText: '#5A6872',
  highlightText: '#152935',
  primary: '#252D6B',
  secondary: '#5596E6',
  placeholder: '#5A6872',
  gray: ['#F5F7FA', '#EBF0F7', '#8C9BA5', '#5A6872'],
  blue: ['#5596E6', '#3D70B2', '#252D6B'],
  green: ['#00AA5E'],
  red: ['#e0182d'],
  inactive: '#8F9BA4',
  idle: '#5596E6',
  alert: '#e0182d',
  warning: '#EFC100',
  success: '#00AA5E',
};

const shadows = {
  0: '',
  1: '0 2px 6px 0 rgba(0, 0, 0, 0.1)',
  2: '0 8px 24px 0 rgba(0, 0, 0, 0.1)',
};

const headings = {
  h1: {
    color: colors.primary,
    fontSize: fontSizes[8],
    fontWeight: fontWeights.bold,
  },
  h2: {
    color: colors.primary,
    fontSize: fontSizes[6],
    fontWeight: fontWeights.bold,
  },
  h3: {
    color: colors.highlightText,
    fontSize: fontSizes[4],
    fontWeight: fontWeights.bold,
  },
  h4: {
    color: colors.baseText,
    fontSize: fontSizes[4],
    fontWeight: fontWeights.normal,
  },
};

const buttons = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
    color: '#fff',
    '&:hover, &:focus': {
      backgroundColor: transparentize(0.2, colors.primary),
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    color: colors.primary,
    '&:hover, &:focus': {
      color: '#fff',
      backgroundColor: colors.primary,
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'currentColor',
    '&:hover, &:focus': {
      color: '#fff',
      backgroundColor: colors.secondary,
    },
    '&:disabled': {
      opacity: 1,
    },
  },
  raw: buttonReset,
};

const links = {
  color: colors.secondary,
  '&:hover, &:focus': {
    color: darken(0.2, colors.secondary),
  },
};

const transitions = {
  hover: {
    ms: 150,
  },
  modal: {
    ms: 200,
  },
};

const maxWidth = '1600px';

const inputs = {
  height: '2.5rem',
  backgroundColor: colors.gray[1],
};

const header = {
  height: '48px',
};

const sidebar = {
  width: '64px',
};

const footer = {
  height: header.height,
};

// NOTE @monitz87: this export is useless but it is needed because the typescript
// compiler doesn't include the "types" import in the declaration file otherwise. Apparently
// it doesn't recognize the use of "types.Token" in the "tokens" definition as an actual
// use of the imported types, and thus ignores it
export type Entity = types.Entity;

const tokens = {
  [types.Tokens.Ether]: {
    color: '#724396',
    backgroundColor: '#EED3FE',
  },
  [types.Tokens.Dai]: {
    color: '#FEBE44',
    backgroundColor: '#FFEFC4',
  },
  [types.Tokens.Poly]: {
    color: '#3C6586',
    backgroundColor: '#C1E6FE',
  },
  [types.Tokens.Erc20]: {
    color: '#007B66',
    backgroundColor: '#A7FAE6',
  },
};

export const theme = {
  breakpoints,
  fontSizes,
  fontFamilies,
  lineHeights,
  fontWeights,
  space,
  zIndexes,
  colors,
  shadows,
  headings,
  buttons,
  links,
  transitions,
  maxWidth,
  inputs,
  header,
  sidebar,
  footer,
  tokens,
};
