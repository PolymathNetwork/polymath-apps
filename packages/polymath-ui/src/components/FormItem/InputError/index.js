import React from 'react';

import FormError from '../../FormError';
import { FormItemContext } from '../';

const InputError = () => (
  <FormItemContext.Consumer>
    {({ name }) => <FormError name={name} />}
  </FormItemContext.Consumer>
);

export default InputError;
