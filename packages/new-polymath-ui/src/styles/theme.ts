interface Scale<TValue> {
  [id: string]: TValue;
}

export const breakpoints = ['42.5em', '64em', '80em']; // 680px, 1024px, 1280px

export const fontSizes: Scale<string> = {
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

export const fontFamilies = {
  baseText: "'Overpass', sans-serif",
};

export const lineHeights = {
  none: 1,
  tight: 1.15,
  normal: 1.5,
  loose: 2,
};

export const fontWeights = {
  light: 300,
  normal: 400,
  bold: 600,
};

export const space: Scale<string> = {
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

export const zIndexes = {
  header: 80,
  sidebar: 100,
};

export const colors = {
  baseText: '#5A6872',
  lightText: '#5A6872',
  highlightText: '#152935',
  primary: '#252D6B',
  secondary: '#3D70B2',
  placeholder: '#5A6872',
  idle: '#3D70B2',
  alert: '#e0182d',
  warning: '#EFC100',
  success: '#00AA5E',
  gray: ['#F5F7FA', '#EBF0F7', '#8C9BA5', '#5A6872'],
  blue: ['#5596E6', '#3D70B2', '#252D6B'],
  green: ['#00AA5E'],
  red: ['#e0182d'],
};

export const headings = {
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

export const transitions = {
  hover: {
    ms: 150,
  },
  modal: {
    ms: 200,
  },
};

export const maxWidth = '1600px';

export const inputs = {
  height: '2.5rem',
  backgroundColor: colors.gray[1],
};

export const header = {
  height: '48px',
};

export const sidebar = {
  width: '64px',
};

export const footer = {
  height: header.height,
};
