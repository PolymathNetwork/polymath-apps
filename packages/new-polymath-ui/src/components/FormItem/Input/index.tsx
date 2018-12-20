import React, { FC, ComponentClass } from 'react';
import { FastField } from 'formik';

import { Context } from '../Context';

export interface Props {
  FormikComponent: ComponentClass<{ name: string }>;
}

export const Input: FC<Props> = ({ FormikComponent, ...props }) => {
  return (
    <Context.Consumer>
      {({ name }) => <FormikComponent name={name} {...props} />}
    </Context.Consumer>
  );
};

Input.defaultProps = {
  FormikComponent: FastField,
};
