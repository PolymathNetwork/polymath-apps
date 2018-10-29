// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';

import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

type Props = InputProps & { value: string };
type State = {| value: string |};

const StyledBaseInput = styled(BaseInput)`
  /* Remove ugly handles on Chrome/Mozilla for number inputs (until mouse hover) */
  /* Only on desktop */

  @media screen and (min-width: 768px) {
    -moz-appearance: textfield;

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
`;

export default class NumberInput extends Component<Props, State> {
  state = {
    value: '',
  };
  static getDerivedStateFromProps(props: Props) {
    const { value } = props;
    return {
      value,
    };
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    const {
      target: { value },
    } = event;

    const normalizedValue = numeral(value);

    setFieldValue(name, normalizedValue);
  };

  render() {
    const {
      field,
      field: { value, ...fieldProps },
      className,
      ...otherProps
    } = this.props;
    return (
      <StyledBaseInput
        type="text"
        id={field.name}
        {...otherProps}
        {...fieldProps}
        onChange={this.handleChange}
      />
    );
  }
}
