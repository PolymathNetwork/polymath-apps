import React, { FC, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { variant as variantHelper } from 'styled-system';
import { get } from 'lodash';
import { Icon } from '~/components/Icon';

const buttonVariant = variantHelper({
  key: 'buttons',
});

type HtmlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type IconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface ButtonProps {
  /**
   * Specify the variant of Button you want to create
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
  iconPosition?: IconPosition;
  onClick: () => void;
}

const getIconStyle = (position: IconPosition) =>
  ({
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }[position]);

export const ButtonComponent: FC<ButtonProps> = ({
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

ButtonComponent.defaultProps = {
  type: 'button',
  disabled: false,
  variant: 'primary',
  iconPosition: 'right',
};

const EnhancedButton = styled(ButtonComponent)<ButtonProps>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  flex-shrink: 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  line-height: 16px;
  border: 2px solid transparent;
  outline: none;
  padding: 0.5rem 1rem;
  min-height: 2.5rem;
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
      background-color: ${({ variant, theme }) =>
        get(theme, `buttons.${variant}.backgroundColor`)};
      color: ${({ variant, theme }) => get(theme, `buttons.${variant}.color`)};
    }
  }

  ${Icon} {
    ${({ theme, iconPosition }) =>
      `margin-${getIconStyle(iconPosition!)}: ${theme.space.s}`};
  }
`;

export const Button = Object.assign(EnhancedButton, {
  defaultProps: ButtonComponent.defaultProps,
});
