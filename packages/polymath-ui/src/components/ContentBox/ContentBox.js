import React from 'react';
import styled from 'styled-components';

import Box from '../Box';

const ContentBox = styled(Box)`
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.space[6]}px;
`;

export default ContentBox;
