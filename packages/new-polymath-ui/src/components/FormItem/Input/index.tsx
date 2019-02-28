import React, { FC } from 'react';
import { FastField, FieldConfig } from 'formik';
import { FormikExternalProps } from '~/components/inputs/FormikProxy';
import { Context } from '../Context';
import { typeHelpers } from '@polymathnetwork/new-shared';
export interface Props
  extends typeHelpers.Omit<FieldConfig, 'name' | 'component'> {
  FormikComponent: React.ComponentType<any>;
  placeholder?: string;
  component: React.ComponentType<FormikExternalProps>;
}

const InputBase: FC<Props> = ({ FormikComponent, ...props }) => {
  return (
    <Context.Consumer>
      {({ name }) => <FormikComponent name={name} {...props} />}
    </Context.Consumer>
  );
};

export const Input = Object.assign(InputBase, {
  defaultProps: {
    FormikComponent: FastField,
  },
});
