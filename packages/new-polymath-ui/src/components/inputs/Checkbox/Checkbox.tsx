import React, { FC, useState, Fragment } from 'react';
import { uniqueId } from 'lodash';
import { InlineFlex } from '~/components/InlineFlex';
import { SvgCheckmark } from '~/images/icons/Checkmark';
import { formikProxy } from '../formikProxy';
import * as sc from './styles';
import { Label } from './Label';

interface Props {
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
  label?: React.ComponentType;
}

export const CheckboxPrimitive: FC<Props> = ({
  name,
  defaultChecked,
  checked,
  onChange,
  label,
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
    <Fragment>
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
          <sc.CheckIcon
            Asset={SvgCheckmark}
            color="white"
            width="0.9rem"
            height="0.9rem"
          />
        </sc.CheckboxInput>
        {label && (
          <InlineFlex ml={2}>
            <Label htmlFor={name || id}>{label}</Label>
          </InlineFlex>
        )}
      </InlineFlex>
    </Fragment>
  );
};

export const Checkbox = formikProxy(CheckboxPrimitive);
