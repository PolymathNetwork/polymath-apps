import React, { Component, ReactNode } from 'react';
import { FieldProps, FormikProps } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';

export interface RenderProps<Value> {
  value: Value;
  name: string;
  onChange: (value: Value) => void;
  onBlur: () => void;
}

export interface ExternalProps {
  field: Pick<FieldProps['field'], 'name' | 'value'>;
  form: Pick<FormikProps<any>, 'setFieldValue' | 'setFieldTouched'>;
}

interface Props<ValueType> extends ExternalProps {
  render: (props: RenderProps<ValueType>) => ReactNode;
}

export class FormikProxy<ValueType> extends Component<Props<ValueType>> {
  public handleChange = (newValue: ValueType) => {
    const { setFieldValue } = this.props.form;
    const { name } = this.props.field;

    setFieldValue(name, newValue);
  };

  public handleBlur = () => {
    const { setFieldTouched } = this.props.form;
    const { name } = this.props.field;

    setFieldTouched(name, true);
  };

  public render() {
    const { field } = this.props;
    const value = field.value;
    const name = field.name;

    return this.props.render({
      name,
      value,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
    });
  }
}
