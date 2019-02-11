import { darken } from 'polished';
import { styled, css } from '~/styles';
import { Flex } from '~/components/Flex';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';

const rowHeight = css(({ theme }) => theme.space.xl);

export const Table = styled.div<{ selectable: boolean }>`
  position: relative;
  display: block;
  overflow: auto;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  padding-top: ${({ selectable }) => selectable && rowHeight};
`;

export const RowBase = styled(Flex)`
  border: solid 1px #ddd;

  & + & {
    margin-top: -1px;
  }
`;

export const BatchActionsToolbar = styled(RowBase)`
  position: absolute;
  top: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  height: ${rowHeight};
  border: none;
`;

export const Row = styled(RowBase)`
  background: ${({ selected, theme }) =>
    selected && darken(0.03, theme.colors.gray[1])};

  &:hover {
    position: relative;
    background: ${({ theme }) => darken(0.03, theme.colors.gray[1])};
    border-color: ${({ theme }) => theme.colors.blue[1]};
  }
`;

export const HeaderRow = styled(RowBase)`
  background: ${({ theme }) => theme.colors.gray[1]};
  color: ${({ theme }) => theme.colors.highlightText};
  border-bottom: none;
`;

export const Cell = styled(Flex)`
  padding: 0.6em;
  height: ${rowHeight};
`;

export const HeaderCell = styled(Cell)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  ${props => {
    const width = (props.sortedIndex + 1) * 5;
    return (
      props.sorted &&
      (props.sortedDesc
        ? css`
            box-shadow: inset 0 ${width}px hsla(0, 100%, 40%);
          `
        : css`
            box-shadow: inset 0 -${width}px hsl(55, 100%, 50%);
          `)
    );
  }};
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

export const ButtonSort = styled(Button)`
  ${Icon} {
    color: ${({ theme }) => theme.colors.gray[3]};
    ${props =>
      props.sorted
        ? props.sortedDesc && 'transform: rotateZ(0.5turn);'
        : 'visibility: hidden;'}};
  }
`;

export const Pagination = styled(RowBase)`
  color: ${({ theme }) => theme.colors.baseText};
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
