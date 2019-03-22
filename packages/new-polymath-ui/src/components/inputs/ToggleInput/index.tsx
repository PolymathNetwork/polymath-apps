import React, { Component, FC } from 'react';
import styled from 'styled-components';

import { FormikProxy, EnhancedComponentProps } from '../FormikProxy';
import { InputProps } from '../types';
import { typeHelpers } from '@polymathnetwork/new-shared';

export interface ToggleInputProps extends InputProps {
  /**
   * Specify whether the toggle should be on by default
   */
  defaultToggled?: boolean;
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
  checked: boolean;
}

interface ExternalProps
  extends typeHelpers.Omit<ToggleInputProps, 'onChange' | 'onBlur'>,
    EnhancedComponentProps<boolean> {}

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

const Wrapper = styled.label`
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

  ${Input}:checked + ${Wrapper} & {
    &:after {
      transform: translateX(24px);
      background-color: #3d70b2;
      box-shadow: none;
      border-color: #3d70b2;
    }
  }
`;

export class ToggleInputPrimitive extends Component<ToggleInputProps> {
  public static defaultProps = {
    defaultToggled: false,
    labelA: 'Off',
    labelB: 'On',
  };

  public inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  public render() {
    const {
      name,
      defaultToggled,
      toggled,
      onChange,
      labelA,
      labelB,
      ...other
    } = this.props;
    let checkedProps;

    if (typeof toggled !== 'undefined') {
      checkedProps = { checked: toggled };
    } else {
      checkedProps = { defaultChecked: defaultToggled };
    }

    return (
      <div>
        <Input
          {...other}
          {...checkedProps}
          type="checkbox"
          id={name}
          name={name}
          onChange={() => {
            if (this.inputRef.current) {
              onChange(this.inputRef.current.checked);
            }
          }}
        />
        <Wrapper htmlFor={name}>
          <Label>{labelA}</Label>
          <Toggle />
          <Label>{labelB}</Label>
        </Wrapper>
      </div>
    );
  }
}

const EnhancedToggleInput: FC<ExternalProps> = ({
  field,
  form,
  onChange,
  ...rest
}) => (
  <FormikProxy<boolean>
    field={field}
    form={form}
    onChange={onChange}
    render={formikProps => <ToggleInputPrimitive {...rest} {...formikProps} />}
  />
);

export const ToggleInput = EnhancedToggleInput;
