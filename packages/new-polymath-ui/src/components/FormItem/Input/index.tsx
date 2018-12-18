import React, { FC, ComponentClass } from 'react';
import { FastField } from 'formik';

import { FormItemContext } from '..';

export interface Props {
  FormikComponent: ComponentClass<{ name: string }>;
}

export const Input: FC<Props> = ({ FormikComponent, ...props }) => {
  return (
    <FormItemContext.Consumer>
      {({ name }) => <FormikComponent name={name} {...props} />}
    </FormItemContext.Consumer>
  );
};

Input.defaultProps = {
  FormikComponent: FastField,
};
