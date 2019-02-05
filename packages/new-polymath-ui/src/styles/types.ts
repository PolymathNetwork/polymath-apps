export interface Scale<TValue> {
  [id: string]: TValue;
}

export interface Breakpoints<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export type ResponsiveValue<T> = T | Array<T | null> | Breakpoints<T>;

export interface ThemeInterface {
  breakpoints: Breakpoints<string | number>;
  fontSizes: Scale<string>;
  fontFamilies: any;
  lineHeights: any;
  fontWeights: any;
  space: Scale<string>;
  zIndexes: any;
  colors: any;
  headings: any;
  buttons: any;
  transitions: any;
  maxWidth: string;
  inputs: any;
  links: any;
  header: any;
  footer: any;
  sidebar: any;
  tokens: any;
}
