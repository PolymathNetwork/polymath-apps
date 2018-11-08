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

      console.log('newValue', newValue);
      setFieldValue(name, newValue);
    };

    handleBlur = () => {
      const { setFieldTouched } = this.props.form;
      const { name } = this.props.field;

      setFieldTouched(name, true);
    };

    render() {
      const { field, form, ...otherProps } = this.props;
      console.log('Prosdwad');
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
  }

  FormikProxy.displayName = `formikProxy(${getDisplayName(WrappedComponent)})`;

  return FormikProxy;
};

export default formikProxy;
