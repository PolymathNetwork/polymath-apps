import React, { FC } from 'react';
import styled from 'styled-components';

import { InlineFlex } from '~/components/InlineFlex';
import { Icon } from '~/components/Icon';
import { SvgCheckmark } from '~/images/icons/Checkmark';
import { formikProxy } from '../formikProxy';

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
  name: string;
}

const Input = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  visibility: visible;
  white-space: nowrap;
`;

const CheckboxInput = styled.label`
  display: block;
  cursor: pointer;
  transition: 250ms cubic-bezier(0.5, 0, 0.1, 1);
  cursor: pointer;
  box-sizing: border-box;
  border: 2px solid #8897a2;
  width: 1.3rem;
  height: 1.3rem;
  background-color: #fff;

  ${Input}:checked + & {
    background-color: #3d70b2;
    border-color: #3d70b2;
  }
`;

const CheckIcon = styled(Icon)`
  pointer-events: none;
`;

export const CheckboxPrimitive: FC<Props> = ({
  name,
  defaultChecked,
  checked,
  onChange,
  ...other
}) => {
  let checkedProps;

  if (typeof checked !== 'undefined') {
    checkedProps = { checked };
  } else {
    checkedProps = { defaultChecked };
  }

  return (
    <InlineFlex>
      <Input
        {...other}
        {...checkedProps}
        type="checkbox"
        id={name}
        name={name}
        onChange={e => {
          onChange(e.target.checked);
        }}
      />
      <CheckboxInput htmlFor={name}>
        {checked ||
          (defaultChecked && <CheckIcon Asset={SvgCheckmark} color="white" />)}
      </CheckboxInput>
    </InlineFlex>
  );
};

export const Checkbox = formikProxy(CheckboxPrimitive);
