import React from 'react';
import styled from 'styled-components';
import { ErrorMessage } from 'formik';

import { FormItemContext } from '../';

const StyledError = styled.div`
  font-size: ${({ theme }) => theme.fontSizes[0]}px;
  color: ${({ theme }) => theme.colors.red[0]};
  order: 3;
  font-weight: 400;
  overflow: visible;
  margin-top: 0.25rem;
  margin-bottom: -1rem;
`;

const InputError = () => (
  <FormItemContext.Consumer>
    {({ name }) => <ErrorMessage component={StyledError} name={name} />}
  </FormItemContext.Consumer>
);

export default InputError;
