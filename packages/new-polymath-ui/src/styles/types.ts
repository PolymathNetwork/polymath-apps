export interface Scale<TValue> {
  [id: string]: TValue;
}

export interface Breakpoints<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export interface Buttons {
  primary: {};
  secondary: {};
  ghost: {};
  ghostSecondary: {};
  raw: {};
}

export interface Selects {
  primary: {};
  ghost: {};
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
  buttons: Buttons;
  selects: Selects;
  transitions: any;
  maxWidth: string;
  inputs: any;
  links: any;
  header: any;
  footer: any;
  sidebar: any;
  tokens: any;
}
