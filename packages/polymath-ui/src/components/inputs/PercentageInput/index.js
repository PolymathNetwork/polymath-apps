import React, { Component } from 'react';
import styled from 'styled-components';

import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

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

export default class PercentageInput extends Component {
  state = {
    value: '',
  };
  static getDerivedStateFromProps(props) {
    const { value } = props;
    return {
      value,
    };
  }

  handleChange = event => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    const {
      target: { value },
    } = event;

    let parsedValue = parseFloat(value, 10);
    if (isNaN(parsedValue)) {
      parsedValue = this.state.value;
    }
    const normalizedValue = parseFloat(value, 10) / 100;

    setFieldValue(name, normalizedValue);
  };

  render() {
    const {
      field,
      field: { value, ...fieldProps },
      className,
      ...otherProps
    } = this.props;

    const formattedValue = typeof value === 'number' ? value * 100 : '';

    return (
      <StyledBaseInput
        type="text"
        id={field.name}
        value={formattedValue}
        allowEmpty={true}
        {...otherProps}
        {...fieldProps}
        onChange={this.handleChange}
      />
    );
  }
}
