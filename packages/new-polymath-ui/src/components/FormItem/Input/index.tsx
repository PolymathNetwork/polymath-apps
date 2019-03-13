import React, { FC } from 'react';
import { FieldConfig, Field } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Context } from '../Context';

export interface Props
  extends typeHelpers.Omit<FieldConfig, 'name' | 'component'> {
  FormikComponent: React.ComponentType<FieldConfig>;
  placeholder?: string;
  component: React.ComponentType<any>;
  inputProps?: { [key: string]: any };
  onChange?: (value: any) => void;
}

export const InputBase: FC<Props> = ({
  FormikComponent,
  component,
  inputProps,
  children,
  onChange,
  validate,
  innerRef,
  ...props
}: Props) => {
  const Component = component;

  return (
    <Context.Consumer>
      {({ name }) => (
        <FormikComponent
          name={name}
          validate={validate}
          innerRef={innerRef}
          render={formikProps => (
            <Component
              {...formikProps}
              {...inputProps}
              {...props}
              onChange={onChange}
            >
              {children}
            </Component>
          )}
        />
      )}
    </Context.Consumer>
  );
};

export const Input = Object.assign(InputBase, {
  defaultProps: {
    // FIXME @RafaelVidaurre: This prop is unusable, the form breaks
    // Switched to Field component as a safer default
    FormikComponent: Field,
  },
});
