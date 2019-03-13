import { styled } from '~/styles';
import { ulReset } from '~/styles/utils';

export const Container = styled.ul<{ vertical: boolean }>`
  ${ulReset};
  display: grid;
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
  list-style: none;
  font-size: ${({ theme }) => theme.fontSizes.baseText};

  ${({ vertical }) =>
    vertical
      ? `
      grid-auto-flow: row;
      height: 100%;
      justify-content: space-between;
      `
      : `
      grid-auto-flow: column;
      height: auto;
    `};
`;
