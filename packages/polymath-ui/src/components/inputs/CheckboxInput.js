// @flow

import React, { Component, Fragment } from 'react';
import { Checkbox as CarbonCheckbox } from 'carbon-components-react';
import type { Node } from 'react';

type Props = {
  input: {
    name: string,
    value: boolean,
    onChange: any => void,
  },
  label: Node,
  className: string,
};

export default class CheckboxInput extends Component<Props> {
  handleChange = (value: [boolean] | boolean) => {
    const { input } = this.props;
    return input.onChange(value instanceof Array ? value[0] : value);
  };

  getValue = () => {
    const { input } = this.props;
    return typeof input.value === 'string' ? false : input.value;
  };

  render() {
    const { input, label, className, ...rest } = this.props;

    return (
      // $FlowFixMe
      <Fragment>
        <CarbonCheckbox
          {...input}
          id={input.name}
          checked={this.getValue()}
          onChange={this.handleChange}
          labelText={label}
          className={className}
          {...rest}
        />
      </Fragment>
    );
  }
}
