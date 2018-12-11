import React, { Component } from 'react';
import { FieldProps } from 'formik';

import { InputProps } from '../types';

function getDisplayName(WrappedComponent: React.ComponentType<InputProps>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * Props proxy that adapts input primitives for Formik
 */
export const formikProxy = <TOriginalProps extends {}>(
  WrappedComponent: React.ComponentType<TOriginalProps & InputProps>
) => {
  const enhancer = class FormikProxy extends Component<
    InputProps & FieldProps
  > {
    static displayName = `formikProxy(${getDisplayName(WrappedComponent)})`;

    handleChange = (newValue: React.ChangeEvent) => {
      const { setFieldValue } = this.props.form;
      const { name } = this.props.field;

      setFieldValue(name, newValue);
    };

    handleBlur = () => {
      const { setFieldTouched } = this.props.form;
      const { name } = this.props.field;

      setFieldTouched(name, true);
    };

    render() {
      const { field, form, ...otherProps } = this.props;

      return (
        <WrappedComponent
          {...otherProps}
          value={field.value}
          name={field.name}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      );
    }
  };

  return enhancer;
};
