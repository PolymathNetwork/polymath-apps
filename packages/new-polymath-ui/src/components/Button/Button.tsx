import React, { FC, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

type HtmlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps {
  /**
   * Specify the kind of Button you want to create
   */
  kind?: string;
  /**
   * Optional prop to specify the tabIndex of the Button
   */
  tabIndex?: HtmlButtonProps['tabIndex'];
  /**
   * Optional prop to specify the type of the Button
   */
  type?: HtmlButtonProps['type'];
  /**
   * Optionally specify an href for your Button to become an <a> element
   */
  href?: string;
  disabled?: HtmlButtonProps['disabled'];
  onClick: () => void;
}

export const ButtonPrimitive: FC<ButtonProps> = ({
  href,
  type,
  tabIndex,
  children,
  ...rest
}) => {
  const passedProps: {
    role?: string;
    type?: string;
  } = {};

  if (href) {
    passedProps.role = 'button';
  } else {
    passedProps.type = type;
  }

  return (
    <button {...passedProps} {...rest}>
      {children}
    </button>
  );
};

export const Button = styled(ButtonPrimitive)<ButtonProps>`
  display: inline-block;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 2.5rem;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  line-height: 16px;
  border: 2px solid transparent;
  outline: none;
  height: 2.5rem;
  padding: 0 1rem;
  transition-duration: ${({ theme }) => theme.transitions.hover.ms}ms;
  transition-property: background, color, border-color;
  font-family: ${({ theme }) => theme.fontFamilies.baseText};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  ${({ kind, theme }) => get(theme, `buttons.${kind}`)};

  &button,
  &input[type='button'],
  &input[type='submit'],
  &input[type='reset'],
  &input[type='file'] {
    border-radius: 0;
  }

  &:focus {
    border-color: #f4f7fb;
  }

  &:disabled {
    &:hover {
      background-color: ${({ kind, theme }) =>
        get(theme, `buttons.${kind}.backgroundColor`)};
      color: ${({ kind, theme }) => get(theme, `buttons.${kind}.color`)};
    }
  }

  > * {
    vertical-align: middle;
  }
`;

Button.defaultProps = {
  tabIndex: 0,
  type: 'button',
  disabled: false,
  kind: 'primary',
};
