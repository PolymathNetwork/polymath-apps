import styled from 'styled-components';

import { Box } from '~/components/Box';
import { Button } from '~/components/Button';

export const Footer = styled(Box)`
  text-align: right;

  ${Button} + ${Button} {
    margin-left: ${({ theme }) => theme.space[3]};
  }
`;
