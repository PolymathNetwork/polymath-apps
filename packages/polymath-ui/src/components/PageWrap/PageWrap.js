// @flow

import styled from 'styled-components';

import Box from '../Box';

const PageWrap = styled(Box)`
  max-width: ${({ theme }) => theme.maxWidth};
  padding-left: calc(${({ theme }) => `${theme.sidebar.width} + 2%`});
  padding-right: calc(${({ theme }) => `${theme.sidebar.width} + 2%`});
`;

PageWrap.defaultProps = {
  mx: 'auto',
};

export default PageWrap;
