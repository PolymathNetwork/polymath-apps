// TODO @grsmto: app should use REM for fontSizes
const fontSizes = [12, 14, 16, 18, 20, 26, 28, 32, 36, 42];
const lineHeights = {
  none: 1,
  tight: 1.15,
  normal: 1.5,
  loose: 2,
};
const space = [0, 5, 10, 15, 25, 30, 50, 80, 120];
const colors = {
  baseText: '#152935',
  lightText: '#5A6872',
  primary: '#252D6B',
  secondary: '#3D70B2',
  placeholder: '#5A6872',
  gray: ['#F5F7FA', '#EBF0F7', '#8C9BA5', '#5A6872'],
  blue: ['#5596E6', '#3D70B2', '#252D6B'],
  green: ['#00AA5E'],
  red: ['#e0182d'],
};
const headings = {
  h1: {
    color: `${colors.primary}`,
    fontSize: `${fontSizes[9]}px`,
    fontWeight: 600,
  },
  h2: {
    color: `${colors.primary}`,
    fontSize: `${fontSizes[5]}px`,
    fontWeight: 400,
  },
  h3: {
    color: `${colors.lightText}`,
    fontSize: `${fontSizes[4]}px`,
    fontWeight: 300,
  },
};
const transitions = {
  hover: 'ease 150ms',
};
const inputs = {
  height: '2.5rem',
};
const navbar = {
  height: '48px',
};
const sidebar = {
  width: '64px',
};

export default {
  fontSizes,
  lineHeights,
  space,
  colors,
  headings,
  transitions,
  inputs,
  navbar,
  sidebar,
};
