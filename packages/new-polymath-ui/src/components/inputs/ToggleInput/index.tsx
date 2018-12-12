import React from 'react';
import styled from 'styled-components';

import { formikProxy } from '../formikProxy';
import { InputProps } from '../types';

export interface ToggleInputProps extends InputProps {
  /**
   * Specify whether the toggle should be on by default
   */
  defaultToggled?: boolean;

  /**
   * Provide an id that unique represents the underlying <input>
   */
  id: string;

  /**
   * Specify whether the control is toggled
   */
  toggled?: boolean;

  /**
   * Specify the label for the "off" position
   */
  labelA: string;

  /**
   * Specify the label for the "on" position
   */
  labelB: string;
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

const Container = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  transition: 250ms cubic-bezier(0.5, 0, 0.1, 1);
  cursor: pointer;
  margin: 1rem 0;
`;

const Label = styled.span``;

const Toggle = styled.span`
  position: relative;
  width: 3rem;
  margin: 0 8px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
    cursor: pointer;
    transition: 250ms cubic-bezier(0.5, 0, 0.1, 1);
  }

  &:before {
    width: 100%;
    height: 0.25rem;
    top: -2px;
    background-color: #8897a2;
  }

  &:after {
    box-sizing: border-box;
    border: 2px solid #8897a2;
    top: -12px;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #fff;
    border-radius: 50%;
  }

  ${Input}:checked + ${Container} & {
    &:after {
      transform: translateX(24px);
      background-color: #3d70b2;
      box-shadow: none;
      border-color: #3d70b2;
    }
  }
`;

export const ToggleInputPrimitive = ({
  name,
  defaultToggled,
  toggled,
  onChange,
  id,
  labelA,
  labelB,
  ...other
}: ToggleInputProps) => {
  let input;
  const checkedProps = {};

  if (typeof toggled !== 'undefined') {
    checkedProps.checked = toggled;
  } else {
    checkedProps.defaultChecked = defaultToggled;
  }

  return (
    <div>
      <Input
        {...other}
        {...checkedProps}
        type="checkbox"
        id={name}
        name={name}
        onChange={evt => {
          onChange(input.checked);
        }}
        ref={el => {
          input = el;
        }}
      />
      <Container htmlFor={name}>
        <Label>{labelA}</Label>
        <Toggle />
        <Label>{labelB}</Label>
      </Container>
    </div>
  );
};

export const ToggleInput = formikProxy(ToggleInputPrimitive);

ToggleInputPrimitive.defaultProps = {
  defaultToggled: false,
  labelA: 'Off',
  labelB: 'On',
};
