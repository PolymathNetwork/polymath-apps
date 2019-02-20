import { darken } from 'polished';
import { styled } from '~/styles';
import { RowBase, Cell as CellBase } from '~/components/Table/styles';

export const Row = styled(RowBase)`
  background: ${({ selected, theme }) =>
    selected && darken(0.03, theme.colors.gray[1])};

  &:hover {
    position: relative;
    background: ${({ theme }) => darken(0.03, theme.colors.gray[1])};
    border-color: ${({ theme }) => theme.colors.blue[1]};
  }
`;

export const Cell = CellBase;
