const fontSizes = [
  '0.75rem', // 12px
  '0.875rem', // 14px
  '1rem',
  '1.125rem', // 18px
  '1.25rem', // 20px
  '1.75rem', // 28px
  '2rem', // 32px
  '2.25rem', // 36px
  '2.625rem', // 42px
];

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
const space = [
  '0',
  '5px',
  '10px',
  '15px',
  '25px',
  '30px',
  '50px',
  '80px',
  '120px',
];
space.m = space[3];
space.l = space[5];
space.xl = space[6];
space.xxl = space[7];
space.xxxl = space[8];

const zIndexes = {
  header: 80,
  sidebar: 100,
};

const colors = {
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
const headings = {
  h1: {
    color: colors.primary,
    fontSize: fontSizes[9],
    fontWeight: fontWeights.bold,
  },
  h2: {
    color: colors.primary,
    fontSize: fontSizes[5],
    fontWeight: fontWeights.bold,
  },
  h3: {
    color: colors.lightText,
    fontSize: fontSizes[4],
    fontWeight: fontWeights.light,
  },
};
const transitions = {
  hover: 'ease 150ms',
};
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

export default {
  fontSizes,
  fontFamilies,
  fontWeights,
  lineHeights,
  space,
  zIndexes,
  colors,
  headings,
  transitions,
  inputs,
  header,
  sidebar,
  footer,
};
