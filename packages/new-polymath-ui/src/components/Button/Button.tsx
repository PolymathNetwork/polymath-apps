import React, { FC, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { get } from 'lodash';
import { Icon } from '~/components/Icon';

const buttonVariant = variant({
  key: 'buttons',
});

type HtmlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps {
  /**
   * Specify the kind of Button you want to create
   */
  variant: 'primary' | 'secondary' | 'ghost';
  /**
   * Optional prop to specify the type of the Button
   */
  type?: HtmlButtonProps['type'];
  /**
   * Optionally specify an href for your Button to become an <a> element
   */
  href?: string;
  disabled?: HtmlButtonProps['disabled'];
  iconPosition?: 'left' | 'right';
  onClick: () => void;
}

export const ButtonBase: FC<ButtonProps> = ({
  href,
  type,
  iconPosition,
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
    <button tabIndex={0} {...passedProps} {...rest}>
      {children}
    </button>
  );
};

ButtonBase.defaultProps = {
  type: 'button',
  disabled: false,
  variant: 'primary',
};

const EnhancedButton = styled(ButtonBase)<ButtonProps>`
  position: relative;
  display: inline-flex;
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
  ${buttonVariant};

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

  ${Icon} {
    ${({ theme, iconPosition }) =>
      `margin-${iconPosition === 'left' ? 'right' : 'left'}: ${theme.space.s}`};
  }
`;

export const Button = Object.assign(EnhancedButton, {
  defaultProps: ButtonBase.defaultProps,
});
