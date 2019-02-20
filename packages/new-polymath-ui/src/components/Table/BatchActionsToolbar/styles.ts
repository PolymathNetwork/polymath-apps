import { styled } from '~/styles';
import { rowHeight, RowBase } from '../styles';

export const BatchActionsToolbar = styled(RowBase)`
  position: absolute;
  top: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  height: ${rowHeight};
  border: none;

  &[hidden] {
    visibility: hidden;
    opacity: 0;
  }
`;
