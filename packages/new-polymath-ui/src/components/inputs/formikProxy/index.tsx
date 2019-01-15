import React, { Component } from 'react';
import { FieldProps } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';

interface InjectedProps {
  value: any | any[];
  name: string;
  onChange: (newValue: any) => void;
  onBlur: () => void;
}

export type OwnProps = FieldProps;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type SharedProps<InjectedP, DecorationTargetProps> = {
  [P in Extract<
    keyof InjectedP,
    keyof DecorationTargetProps
  >]?: InjectedP[P] extends DecorationTargetProps[P] ? P : never
}[Extract<keyof InjectedP, keyof DecorationTargetProps>];

export type Matching<InjectedP, DecorationTargetProps> = {
  [P in keyof DecorationTargetProps]: P extends keyof InjectedP
    ? InjectedP[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : InjectedP[P]
    : DecorationTargetProps[P]
};

export const formikProxy = <
  C extends React.ComponentType<
    Matching<InjectedProps, typeHelpers.GetProps<C>>
  >
>(
  WrappedComponent: C
): React.ComponentType<
  JSX.LibraryManagedAttributes<
    C,
    Omit<
      typeHelpers.GetProps<C>,
      keyof SharedProps<InjectedProps, typeHelpers.GetProps<C>>
    > &
      OwnProps
  >
> => {
  class FormikProxy extends Component<any> {
    public handleChange = (newValue: any) => {
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
      const { field, ...otherProps } = this.props;
      const AnyWrappedComponent = WrappedComponent as React.ComponentType<any>;
      return (
        <AnyWrappedComponent
          {...otherProps}
          value={field.value}
          name={field.name}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      );
    }
  }

  return Object.assign(FormikProxy, {
    defaultProps: WrappedComponent.defaultProps,
  });
};
