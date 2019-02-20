// Packages
import React, { FC } from 'react';
import { Formik } from 'formik';
import { typeHelpers } from '@polymathnetwork/new-shared';

// We just build a wrapper so rest of the app is not
// aware of Formik dependency.

type FormikProps = typeHelpers.GetProps<typeof Formik>;

interface Props extends FormikProps {}

export const Form: FC<Props> = props => {
  return (
    <Formik
      {...props}
      render={formikProps => {
        return props.render(formikProps);
      }}
    />
  );
};
