import React from 'react';
import styled from 'styled-components';
import { ErrorMessage } from 'formik';

import { FormItemContext } from '..';

import { formError } from '../../../styles/utils';

const StyledError = styled.span`
  ${formError};
  margin-top: 0.25rem;
  float: left;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const InputError = props => (
  <FormItemContext.Consumer>
    {({ name }) => (
      <ErrorMessage component={StyledError} name={name} {...props} />
    )}
  </FormItemContext.Consumer>
);
