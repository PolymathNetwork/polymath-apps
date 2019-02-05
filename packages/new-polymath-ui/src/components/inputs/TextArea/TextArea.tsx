import React, { Component, ChangeEvent } from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';

import { formikProxy } from '../formikProxy';

export interface TextAreaProps
  extends typeHelpers.Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onChange'
  > {
  error?: string;
  onChange: (value?: string) => void;
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
  public static defaultProps = {
    onChange: () => {},
  };
  public handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    const { onChange } = this.props;

    onChange(value);
  };

  public render() {
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

const EnhancedTextArea = formikProxy(TextAreaPrimitive);
export const TextArea = Object.assign(EnhancedTextArea, {
  defaultProps: TextAreaPrimitive.defaultProps,
});
