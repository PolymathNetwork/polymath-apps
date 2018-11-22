import React from 'react';

import Box from '../Box';

const Footer = props => {
  return (
    <Box textAlign="right" mt="auto" mb={[0, -1]}>
      {props.children}
    </Box>
  );
};

export default Footer;
