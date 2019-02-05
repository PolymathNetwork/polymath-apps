import styled from 'styled-components';

import { Box } from '~/components/Box';
import { Button } from '~/components/Button';

export const Footer = styled(Box)`
  text-align: right;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space.gridGap};

  ${Button} + ${Button} {
    margin-left: ${({ theme }) => theme.space[3]};
  }
`;
