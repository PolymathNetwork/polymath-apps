/**
 * TODO @monitz87: implement our own TextArea component
 */
import React, { Component } from 'react';

import { TextArea } from 'carbon-components-react';

import formikProxy from '../formikProxy';

export class TextAreaWrapper extends Component {
  handleChange = event => {
    const { value } = event.target;
    const { onChange } = this.props;

    onChange(value);
  };
  render() {
    const { onChange, ...inputProps } = this.props;
    return <TextArea onChange={this.handleChange} {...inputProps} />;
  }
}

export default formikProxy(TextAreaWrapper);
