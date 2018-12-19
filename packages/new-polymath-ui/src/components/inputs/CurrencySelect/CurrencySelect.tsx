import React, { Component } from 'react';

import { Input } from './Input';

import { formikProxy } from '../formikProxy';

// TODO @RafaelVidaurre: Add uncontrolled input support for primitives

class CurrencySelectComponent extends Component {
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
  };

  handleChange = value => {
    const { onChange, onBlur } = this.props;
    onChange(value);
    onBlur();
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    onBlur();
  };

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

export const CurrencySelect = formikProxy(CurrencySelectComponent);
