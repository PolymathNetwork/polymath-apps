import React, { Component } from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * Props proxy that adapts input primitives for Formik
 */
const formikProxy = WrappedComponent => {
  class FormikProxy extends Component {
    handleChange = newValue => {
      const { setFieldValue } = this.props.form;
      const { name } = this.props.field;

      setFieldValue(name, newValue);
    };
    render() {
      const { field, form, ...otherProps } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          value={field.value}
          name={field.name}
          onChange={this.handleChange}
        />
      );
    }
  }

  FormikProxy.displayName = `formikProxy(${getDisplayName(WrappedComponent)})`;

  return FormikProxy;
};

export default formikProxy;
