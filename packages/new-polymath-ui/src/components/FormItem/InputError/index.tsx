import React, { FC } from 'react';
import styled from 'styled-components';
import { ErrorMessage, ErrorMessageProps } from 'formik';

import { FormItemContext } from '~/components/FormItem';
import { formError } from '~/styles/utils';

export interface Props extends ErrorMessageProps {}

const StyledError = styled.span`
  ${formError};
  margin-top: 0.25rem;
  float: left;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const InputError: FC<Props> = props => (
  <FormItemContext.Consumer>
    {({ name }) => (
      <ErrorMessage component={StyledError} name={name} {...props} />
    )}
  </FormItemContext.Consumer>
);
