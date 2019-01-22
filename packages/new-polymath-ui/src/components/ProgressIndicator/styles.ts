import { styled } from '~/styles';
import { ulReset } from '~/styles/utils';

export const Container = styled.ul<{ vertical: boolean }>`
  ${ulReset};
  display: flex;
  list-style: none;
  font-size: ${({ theme }) => theme.fontSizes.baseText};

  ${({ vertical }) =>
    vertical
      ? `
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      `
      : `
      flex-direction: row;
      height: auto;
    `};
`;
