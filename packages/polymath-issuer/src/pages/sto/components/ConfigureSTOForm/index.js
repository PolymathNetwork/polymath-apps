// @flow

import React from 'react';
import * as forms from './forms';

import type { STOModule } from '../../../../constants';

type Props = {|
  stoModule: STOModule,
|};

export const ConfigureSTOFormComponent = ({ stoModule }: Props) => {
  const { type } = stoModule;

  // Find the right form component for the stoModule's type
  const FormComponent = forms[type];

  if (!FormComponent) {
    throw new Error(`No form component exists for STO module type "${type}"`);
  }

  return <FormComponent stoModule={stoModule} />;
};

export default ConfigureSTOFormComponent;
