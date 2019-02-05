/**
 * TODO @monitz87: implement our own Toggle component
 */
import React, { Component } from 'react';

import { Toggle } from 'carbon-components-react';

import formikProxy from '../formikProxy';

export class ToggleInputWrapper extends Component {
  render() {
    const { onChange, name, ...inputProps } = this.props;

    return <Toggle id={name} name={name} onToggle={onChange} {...inputProps} />;
  }
}

export default formikProxy(ToggleInputWrapper);
