import { css } from 'styled-components';
import { darken, lighten, getLuminance } from 'polished';

export const ellipsis = `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const formError = css`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  color: ${({ theme }) => theme.colors.red[0]};
  font-weight: 400;
`;

export const textLinkInverted = `
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;
  }
`;

export const ulReset = `
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const buttonReset = `
  padding: 0;
  background: none;
  text-transform: none;
  letter-spacing: normal;
`;

export const getHoverColor = (color: string) =>
  getLuminance(color) > 0.5 ? darken(0.2, color) : lighten(0.2, color);
