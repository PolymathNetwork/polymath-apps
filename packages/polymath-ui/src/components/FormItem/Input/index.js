import React from 'react';
import { FastField } from 'formik';

import { FormItemContext } from '../';

const Input = ({ FormikComponent, ...props }) => {
  return (
    <FormItemContext.Consumer>
      {({ name }) => <FormikComponent name={name} {...props} />}
    </FormItemContext.Consumer>
  );
};

Input.defaultProps = {
  FormikComponent: FastField,
};

export default Input;
