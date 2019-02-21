import { styled } from '~/styles';
import { Flex } from '~/components/Flex';
import { RowBase } from '../styles';

export const RowActions = styled(Flex)`
  visibility: hidden;
  opacity: 0;

  ${RowBase}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;
