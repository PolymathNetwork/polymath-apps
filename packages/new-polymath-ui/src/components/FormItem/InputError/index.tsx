import React, { FC } from 'react';
import styled from 'styled-components';
import { ErrorMessage, ErrorMessageProps } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { formError } from '~/styles/utils';
import { Context } from '../Context';

export interface Props extends typeHelpers.Omit<ErrorMessageProps, 'name'> {}

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
  <Context.Consumer>
    {({ name }) => (
      <ErrorMessage component={StyledError} name={name} {...props} />
    )}
  </Context.Consumer>
);
