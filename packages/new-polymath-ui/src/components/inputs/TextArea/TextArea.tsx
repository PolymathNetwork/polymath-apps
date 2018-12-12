import React, { Component } from 'react';

import { formikProxy } from '../formikProxy';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export class TextAreaPrimitive extends Component<TextAreaProps> {
  handleChange = event => {
    const { value } = event.target;
    const { onChange } = this.props;

    onChange(value);
  };

  render() {
    const { onChange, error, ...textareaProps } = this.props;

    const input = error ? (
      <textarea
        onChange={this.handleChange}
        {...textareaProps}
        aria-invalid
        aria-describedby={error}
        data-invalid
      />
    ) : (
      <textarea onChange={this.handleChange} {...textareaProps} />
    );

    return input;
  }
}

export const TextArea = formikProxy(TextAreaPrimitive);
