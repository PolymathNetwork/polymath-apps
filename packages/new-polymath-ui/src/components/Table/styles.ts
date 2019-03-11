import { styled, css, ThemeInterface } from '~/styles';
import { Box } from '~/components/Box';
import { Flex } from '~/components/Flex';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';

export const rowHeight = css(
  ({ theme, small }: { theme: ThemeInterface; small?: boolean }) =>
    small ? theme.space.l : theme.space.xl
);

export const Table = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
`;

export const Inner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const RowBase = styled(Flex)`
  border: solid 1px #ddd;

  & + & {
    margin-top: -1px;
  }
`;

export const HeaderRow = styled(RowBase)`
  position: sticky;
  top: 0;
  bottom: auto;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gray[1]};
  color: ${({ theme }) => theme.colors.highlightText};
  border-bottom: none;
`;

export const Cell = styled(Flex)`
  padding: 0.6em;
  height: ${rowHeight};
  color: ${({ hasError, theme }) => hasError && theme.colors.alert};

  &:first-child {
    padding-left: ${({ theme }) => theme.space.gridGap};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.space.gridGap};
  }
`;

export const HeaderCell = styled(Cell)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const Select = styled.select`
  appearance: none;
  background: white;
  border: 0;
  margin: 0;
  color: black;
  font-size: 1rem;
  padding: 0.5rem 0.7rem;
  border: 0;
  cursor: pointer;
`;

export const Input = styled.input`
  font-size: 1rem;
  padding: 0.5rem 0.7rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  max-width: 100%;
`;

export const ButtonSort = styled(Button)<{
  sorted: boolean;
  sortedDesc: boolean;
}>`
  white-space: normal;
  flex-shrink: 1;
  text-align: left;

  ${Icon} {
    color: ${({ theme }) => theme.colors.gray[3]};
    ${props =>
      props.sorted
        ? props.sortedDesc && 'transform: rotateZ(0.5turn);'
        : 'visibility: hidden;'}
  }
`;

const ButtonPagination = styled(Button)`
  color: ${({ theme }) => theme.colors.blue[1]};
  border-left: solid 1px #ddd;
  border-right: solid 1px #ddd;
  border-top: none;
  border-bottom: none;
  padding-left: 0.8rem;
  padding-right: 0.8rem;

  &:last-child {
    border-right: none;
  }
`;

export const ButtonPreviousPage = styled(ButtonPagination)`
  ${Icon} {
    transform: rotateZ(0.25turn);
  }
`;

export const ButtonNextPage = styled(ButtonPagination)`
  ${Icon} {
    transform: rotateZ(-0.25turn);
  }
`;

export const Toolbar = styled.div`
  height: ${rowHeight};
`;

export const Body = styled.div`
  min-height: 200px;
`;
