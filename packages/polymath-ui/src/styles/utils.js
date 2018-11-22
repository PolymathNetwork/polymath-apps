import { css } from 'styled-components';

export const ellipsis = `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const formError = css`
  font-size: ${({ theme }) => theme.fontSizes[0]}px;
  color: ${({ theme }) => theme.colors.red[0]};
  font-weight: 400;
`;
