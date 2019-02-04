import { ButtonHTMLAttributes } from 'react';
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
   * Optionally specify an href for your Button
   */
  href?: string;
  role?: string;
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

const EnhancedButton = styled.button.attrs<ButtonProps>({
  tabIndex: 0,
  role: (props: ButtonProps) => (props.href ? 'button' : undefined),
  type: (props: ButtonProps) => (props.href ? undefined : 'button'),
})<ButtonProps>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid transparent;
  outline: none;
  padding: 0.5rem 1rem;
  min-height: 2.5rem;
  line-height: 1;
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

EnhancedButton.defaultProps = {
  variant: 'primary',
  iconPosition: 'right',
};

export const Button = EnhancedButton;
