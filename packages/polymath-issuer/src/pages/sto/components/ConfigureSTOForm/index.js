// @flow

import React from 'react';
import * as forms from './forms';

import type { STOModule } from '../../../../constants';

type Props = {|
  stoModule: STOModule,
|};

export default ({ stoModule }: Props) => {
  const { type } = stoModule;

  const FormComponent = forms[type];

  if (!FormComponent) {
    throw new Error(`No form component exists for STO module type "${type}"`);
  }

  return <FormComponent stoModule={stoModule} />;
};
