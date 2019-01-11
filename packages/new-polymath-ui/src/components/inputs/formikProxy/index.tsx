import React, { Component } from 'react';

import { FieldProps } from 'formik';
// type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;

interface InjectedProps {
  value: any | any[];
  name: string;
  onChange: (newValue: any) => void;
  onBlur: () => void;
}

export interface OwnProps extends FieldProps {}

// function getDisplayName(WrappedComponent: ComponentType<any>) {
//   return WrappedComponent.displayName || WrappedComponent.name || 'Component';
// }

// /**
//  * Props proxy that adapts input primitives for Formik
//  */
// export const formikProxy = <C extends ComponentType<GetProps<C>>>(
//   WrappedComponent: ComponentType<GetProps<C>>
// ): React.ComponentType<JSX.LibraryManagedAttributes<C, GetProps<C>>> => {
//   const enhancer = class FormikProxy extends Component<GetProps<C> & HocProps> {
//     public static displayName = `formikProxy(${getDisplayName(
//       WrappedComponent
//     )})`;

//     public handleChange = (newValue: any) => {
//       const { setFieldValue } = this.props.form;
//       const { name } = this.props.field;

//       setFieldValue(name, newValue);
//     };

//     public handleBlur = () => {
//       const { setFieldTouched } = this.props.form;
//       const { name } = this.props.field;

//       setFieldTouched(name, true);
//     };

//     public render() {
//       const { field, form, ...otherProps } = this.props as any;

//       return (
//         <WrappedComponent
//           {...otherProps}
//           value={field.value}
//           name={field.name}
//           onChange={this.handleChange}
//           onBlur={this.handleBlur}
//         />
//       );
//     }
//   };

//   return enhancer;
// };

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;

export type BetterShared<Ipsx, DecorationTargetProps> = {
  [P in Extract<
    keyof Ipsx,
    keyof DecorationTargetProps
  >]?: Ipsx[P] extends DecorationTargetProps[P] ? P : never
}[Extract<keyof Ipsx, keyof DecorationTargetProps>];

export type Matching<Ips, DecorationTargetProps> = {
  [P in keyof DecorationTargetProps]: P extends keyof Ips
    ? Ips[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : Ips[P]
    : DecorationTargetProps[P]
};

export const formikProxy = <
  C extends React.ComponentType<Matching<InjectedProps, GetProps<C>>>
>(
  WrappedComponent: C
): React.ComponentType<
  JSX.LibraryManagedAttributes<
    C,
    Omit<GetProps<C>, keyof BetterShared<InjectedProps, GetProps<C>>> & OwnProps
  >
> => {
  return class FormikProxy extends Component<any> {
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
  };
};
