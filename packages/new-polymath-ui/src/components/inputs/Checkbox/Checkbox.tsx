import React, { FC, useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import { InlineFlex } from '~/components/InlineFlex';
import { SvgCheckmark } from '~/images/icons/Checkmark';
import { formikProxy } from '../formikProxy';
import * as sc from './styles';

export interface Props {
  onChange: (e: any) => void;
  /**
   * Specify whether the toggle should be on by default
   */
  defaultChecked?: boolean;
  /**
   * Specify whether the control is checked
   */
  checked?: boolean;
  name?: React.AllHTMLAttributes<HTMLInputElement>['name'];
}

export const CheckboxPrimitive: FC<Props> = ({
  name,
  defaultChecked,
  checked,
  onChange,
  ...other
}) => {
  const [id] = useState(uniqueId());
  let checkedProps;

  if (typeof checked !== 'undefined') {
    checkedProps = { checked };
  } else {
    checkedProps = { defaultChecked };
  }

  return (
    <InlineFlex>
      <sc.Input
        {...other}
        {...checkedProps}
        type="checkbox"
        id={name || id}
        name={name || id}
        onChange={e => {
          onChange(e.target.checked);
        }}
      />
      <sc.CheckboxInput htmlFor={name || id}>
        <sc.CheckIcon Asset={SvgCheckmark} color="white" />
      </sc.CheckboxInput>
    </InlineFlex>
  );
};

export const Checkbox = formikProxy(CheckboxPrimitive);
