import { Component, ReactNode } from 'react';
import { FieldProps, FormikProps } from 'formik';

export interface RenderProps<Value> {
  value: Value;
  name: string;
  onChange: (value: Value) => void;
  onBlur: () => void;
}

interface FormikExternalProps {
  field: Pick<FieldProps['field'], 'name' | 'value'>;
  form: Pick<FormikProps<any>, 'setFieldValue' | 'setFieldTouched'>;
}

export interface EnhancedComponentProps<ValueType> extends FormikExternalProps {
  onChange?: (value: ValueType) => void;
  onBlur?: () => void;
}

interface Props<ValueType> extends EnhancedComponentProps<ValueType> {
  render: (props: RenderProps<ValueType>) => ReactNode;
}

export class FormikProxy<ValueType> extends Component<Props<ValueType>> {
  public handleChange = (newValue: ValueType) => {
    const { setFieldValue } = this.props.form;
    const { name } = this.props.field;
    const { onChange } = this.props;

    if (onChange) {
      onChange(newValue);
    }

    setFieldValue(name, newValue);
  };

  public handleBlur = () => {
    const { setFieldTouched } = this.props.form;
    const { name } = this.props.field;
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }

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
