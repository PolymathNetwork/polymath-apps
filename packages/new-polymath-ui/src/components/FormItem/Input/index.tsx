import React, { FC, Component } from 'react';
import { FastField, FieldConfig, Field, FieldProps } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Context } from '../Context';

export interface Props
  extends typeHelpers.Omit<FieldConfig, 'name' | 'component'> {
  FormikComponent: React.ComponentType<FieldConfig>;
  placeholder?: string;
  component: React.ComponentType<any>;
  inputProps: {
    [key: string]: any;
  };
}

export class InputBase extends Component<Props> {
  public render() {
    const { FormikComponent, component, inputProps, ...props } = this.props;

    return (
      <Context.Consumer>
        {({ name }) => (
          <FormikComponent
            {...inputProps}
            {...props}
            name={name}
            component={component}
          />
        )}
      </Context.Consumer>
    );
  }
}

export const Input = Object.assign(InputBase, {
  defaultProps: {
    FormikComponent: FastField,
  },
});
