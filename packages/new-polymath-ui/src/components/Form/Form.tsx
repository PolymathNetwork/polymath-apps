import React from 'react';
import { Formik, FormikValues, FormikConfig } from 'formik';

// We just build a wrapper so rest of the app is not
// aware of Formik dependency.

// NOTE @monit87: had to change this from a functional component to a class because of generic typing issues
export class Form<Values extends FormikValues> extends React.Component<
  FormikConfig<Values>
> {
  public render() {
    const { props } = this;
    return (
      <Formik<Values>
        {...props}
        render={formikProps => {
          return props.render ? props.render(formikProps) : null;
        }}
      />
    );
  }
}
