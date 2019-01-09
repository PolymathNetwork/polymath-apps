import React, { Component } from 'react';
import styled from 'styled-components';

import { formikProxy } from '../formikProxy';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const StyledTextArea = styled.textarea`
  width: 100%;
  min-width: 10rem;
  padding: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  color: ${({ theme }) => theme.colors.baseText};
  font-family: ${({ theme }) => theme.fontFamilies.baseText};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  border: none;
`;

export class TextAreaPrimitive extends Component<TextAreaProps> {
  handleChange = event => {
    const { value } = event.target;
    const { onChange } = this.props;

    onChange(value);
  };

  render() {
    const { onChange, error, ...textareaProps } = this.props;

    const input = error ? (
      <StyledTextArea
        onChange={this.handleChange}
        {...textareaProps}
        aria-invalid
        aria-describedby={error}
        data-invalid
      />
    ) : (
      <StyledTextArea onChange={this.handleChange} {...textareaProps} />
    );

    return input;
  }
}

export const TextArea = formikProxy(TextAreaPrimitive);
