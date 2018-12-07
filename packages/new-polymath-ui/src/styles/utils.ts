import { css } from 'styled-components';
import { themeGet } from 'styled-system';

export const ellipsis = `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const formError = css`
  font-size: ${themeGet('fontSizes[0]')};
  color: ${themeGet('colors.red[0]')};
  font-weight: 400;
`;

export const textLinkInverted = `
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;
  }
`;
