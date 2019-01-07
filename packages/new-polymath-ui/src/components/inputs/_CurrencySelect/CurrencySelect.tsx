import React, { Component } from 'react';

import { Input } from './Input';

import { formikProxy } from '../formikProxy';

// TODO @RafaelVidaurre: Add uncontrolled input support for primitives
class CurrencySelectComponent extends Component {
  public static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
  };

  public handleChange = value => {
    const { onChange, onBlur } = this.props;
    onChange(value);
    onBlur();
  };

  public handleBlur = () => {
    const { onBlur } = this.props;
    onBlur();
  };

  public render() {
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
