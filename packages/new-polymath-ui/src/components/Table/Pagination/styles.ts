import { styled } from '~/styles';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';
import { RowBase } from '../styles';

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
