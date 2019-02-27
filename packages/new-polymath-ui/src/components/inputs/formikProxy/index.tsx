import React, { Component } from 'react';
import { FieldProps } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';

interface Props {
  field: FieldProps,
  form: 
}

class FormikProx extends Component<Props> {
  public handleChange = (newValue: any) => {
    const { setFieldValue } = this.props.form;
    const { name } = this.props.field;

    setFieldValue(name, newValue);
  }

  public handleBlur = (newValue: any) => {
    
  }
}
