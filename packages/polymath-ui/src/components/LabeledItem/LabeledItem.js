import styled from 'styled-components';

import Paragraph from '../Paragraph';
import Box from '../Box';

const LabeledItem = styled(Box)`
  & + & {
    margin-top: ${({ theme }) => theme.space[4]};
  }

  ${Paragraph}:last-child {
    margin-bottom: 0;
  }
`;

export default LabeledItem;
