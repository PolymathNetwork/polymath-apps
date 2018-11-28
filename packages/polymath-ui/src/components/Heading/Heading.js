import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';

import Paragraph from '../Paragraph';

const headingStyle = variant({
  key: 'headings',
});

const Heading = styled(Paragraph)`
  ${headingStyle};
`;

export default Heading;

Heading.defaultProps = {
  variant: 'h3',
  as: 'h2',
  lineHeight: 'normal',
  fontWeight: 'bold',
  mb: 'm',
};
