import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { ErrorMessage } from 'formik';
import { FormItemContext } from '~/components/FormItem';
import { formError } from '~/styles/utils';

interface Props {
  children?: (() => ReactNode);
}

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
