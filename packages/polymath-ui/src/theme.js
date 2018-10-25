// TODO @grsmto: app should use REM for fontSizes and spacing
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42];
const space = [0, 5, 10, 15, 25, 30, 50, 80, 120];
const colors = {
  baseText: '#152935',
  primary: '#252D6B',
  secondary: '#3D70B2',
  gray: ['#F5F7FA', '#8C9BA5', '#5A6872'],
  blue: ['#EBF0F7', '#5596E6', '#3D70B2', '#252D6B'],
  green: ['#00AA5E'],
  red: ['#e0182d'],
};

const headings = {
  h1: {},
  h2: {},
  h3: {
    fontSize: `${fontSizes[4]}px`,
    fontWeight: 600,
    marginBottom: `${space[4]}px`,
  },
};
const transitions = {
  hover: 'ease 150ms',
};

export default {
  fontSizes,
  space,
  colors,
  headings,
  transitions,
};
