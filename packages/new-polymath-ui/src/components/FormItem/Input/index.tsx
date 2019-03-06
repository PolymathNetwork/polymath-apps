import React, { FC } from 'react';
import { FastField, FieldConfig } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Context } from '../Context';

export interface Props
  extends typeHelpers.Omit<FieldConfig, 'name' | 'component'> {
  FormikComponent: React.ComponentType<FieldConfig>;
  placeholder?: string;
  component: React.ComponentType<any>;
  inputProps?: {
    [key: string]: any;
  };
}

export const InputBase: FC<Props> = ({
  FormikComponent,
  component,
  inputProps,
  children,
  ...props
}) => {
  const Component = component;

  return (
    <Context.Consumer>
      {({ name }) => (
        <FormikComponent
          name={name}
          render={formikProps => (
            <Component {...formikProps} {...inputProps} {...props}>
              {children}
            </Component>
          )}
        />
      )}
    </Context.Consumer>
  );
};

export const Input = Object.assign(InputBase, {
  defaultProps: {
    FormikComponent: FastField,
  },
});
