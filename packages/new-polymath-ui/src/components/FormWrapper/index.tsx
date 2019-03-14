import React from 'react';
import { Formik, FormikValues, FormikConfig } from 'formik';

// We just build a wrapper so rest of the app is not
// aware of Formik dependency.

export interface Props<Values> extends FormikConfig<Values> {
  onFieldChange?: (field: string, value: any) => void;
}

// NOTE @monit87: had to change this from a functional component to a class because of generic typing issues
export class FormWrapper<Values extends FormikValues> extends React.Component<
  Props<Values>
> {
  public formRef: React.RefObject<Formik<Values>>;
  public constructor(props: Props<Values>) {
    super(props);
    this.formRef = React.createRef<Formik<Values>>();
  }
  public componentDidMount() {
    const { onFieldChange } = this.props;
    const { current } = this.formRef;
    const { setFieldValue } = current!;
    current!.setFieldValue = (
      field: keyof Values & string,
      value: any,
      shouldValidate?: boolean
    ) => {
      if (onFieldChange) {
        onFieldChange(field, value);
      }
      setFieldValue(field, value, shouldValidate);
    };
  }

  public handleSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    const { current } = this.formRef;

    if (!current) {
      return false;
    }

    return current.getFormikBag().handleSubmit(e);
  };

  public setSubmitting = (value: boolean) => {
    const { current } = this.formRef;

    if (!current) {
      return false;
    }

    return current.getFormikBag().setSubmitting(value);
  };

  public render() {
    const { onFieldChange, render, ...rest } = this.props;
    return (
      <Formik<Values>
        {...rest}
        ref={this.formRef}
        render={formikProps => {
          return render ? render(formikProps) : null;
        }}
      />
    );
  }
}
