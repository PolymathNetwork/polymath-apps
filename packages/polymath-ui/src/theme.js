const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42];
const space = [0, 5, 10, 20, 30, 50, 80, 120];
const colors = {
  baseTextColor: '#152935',
  gray: ['#EBF0F7', '#8C9BA5', '#5A6872'],
  blue: ['#5596E6', '#3D70B2'],
  green: ['#00AA5E'],
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

export default {
  fontSizes,
  space,
  colors,
  headings,
};
