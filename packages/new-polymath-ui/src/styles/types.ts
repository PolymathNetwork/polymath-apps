export interface Scale<TValue> {
  [id: string]: TValue;
}

export interface ThemeInterface {
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
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
