import { styled } from '~/styles';
import { Flex } from '~/components/Flex';
import { Row } from '../Rows/Row/styles';

export const RowActions = styled(Flex)`
  visibility: hidden;
  opacity: 0;

  ${Row}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;
