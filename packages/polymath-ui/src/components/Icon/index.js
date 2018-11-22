import React from 'react';
import styled from 'styled-components';

const Icon = ({ Icon, className, ...props }) => (
  <Icon className={className} {...props} />
);

export default styled(Icon)`
  vertical-align: middle;
`;
