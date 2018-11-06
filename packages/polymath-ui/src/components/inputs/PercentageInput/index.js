// @flow

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';

import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

type Props = InputProps & { value: string };

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

export default class PercentageInput extends PureComponent<Props, State> {
  handleChange = event => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    const {
      target: { value },
    } = event;

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
    const formattedValue = isNaN(value)
      ? ''
      : Math.max(
          Math.min(
            numeral(value) // This avoid strange JS decimal converting: 0.1111*100 = 11.110000000000001
              .multiply(100)
              .value(),
            100
          ),
          0
        );

    return (
      <StyledBaseInput
        type="number"
        unit="%"
        min={0}
        max={100}
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
