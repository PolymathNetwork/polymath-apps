import React from 'react';
import { Formik, FormikValues, FormikConfig } from 'formik';

// We just build a wrapper so rest of the app is not
// aware of Formik dependency.

export interface Props<Values> extends FormikConfig<Values> {
  onFieldChange?: (field: string, value: any) => void;
}

// NOTE @monit87: had to change this from a functional component to a class because of generic typing issues
export class Form<Values extends FormikValues> extends React.Component<
  Props<Values>
> {
  public formikRef: React.RefObject<Formik<Values>>;
  public constructor(props: Props<Values>) {
    super(props);
    this.formikRef = React.createRef<Formik<Values>>();
  }
  public componentDidMount() {
    const { onFieldChange } = this.props;
    const { current } = this.formikRef;
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
  public render() {
    const { onFieldChange, render, ...rest } = this.props;
    return (
      <Formik<Values>
        {...rest}
        ref={this.formikRef}
        render={formikProps => {
          return render ? render(formikProps) : null;
        }}
      />
    );
  }
}
