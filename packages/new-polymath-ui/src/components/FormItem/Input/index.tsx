import React, { FC } from 'react';
import { FastField, FieldConfig } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';

import { Context } from '../Context';

export interface Props extends typeHelpers.Omit<FieldConfig, 'name'> {
  FormikComponent: React.ComponentType<any>;
}

export const Input: FC<Props> = ({ FormikComponent, ...props }) => {
  return (
    <Context.Consumer>
      {({ name }) => <FormikComponent name={name} {...props} />}
    </Context.Consumer>
  );
};

Input.defaultProps = {
  FormikComponent: FastField,
};
