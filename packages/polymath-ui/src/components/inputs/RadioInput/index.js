/**
 * TODO @monitz87: implement our own RadioInput component
 */
import React, { Component } from 'react';

import { RadioButtonGroup, RadioButton } from 'carbon-components-react';

import formikProxy from '../formikProxy';

export class RadioInputWrapper extends Component {
  render() {
    const { value, options, name, ...inputProps } = this.props;

    return (
      <RadioButtonGroup
        id={name}
        name={name}
        valueSelected={value}
        {...inputProps}
      >
        {options.map(({ value, label }) => (
          <RadioButton
            key={value}
            value={value}
            id={`${name}-${value}`}
            labelText={label}
          />
        ))}
      </RadioButtonGroup>
    );
  }
}

export default formikProxy(RadioInputWrapper);
