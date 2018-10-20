import React from 'react';
import { InlineFlex, Block } from 'reakit';
import styled from 'styled-components';

import theme from '../../../theme';

const Ellipsis = styled(Block)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Label = ({ icon, text }) => (
  <InlineFlex maxWidth="100%">
    <img src={icon} alt={text} />
    <Ellipsis marginLeft={theme.space[2]}>{text}</Ellipsis>
  </InlineFlex>
);

export default Label;
