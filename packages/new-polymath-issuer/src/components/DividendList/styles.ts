import { styled, ButtonLink, ThemeInterface } from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

type NewDividendButtonType = StyledComponent<
  typeof ButtonLink,
  ThemeInterface,
  {},
  never
>;

export const NewDividendButtonBase: NewDividendButtonType = styled(ButtonLink)`
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};

  &[disabled]:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const NewDividendButton: NewDividendButtonType = Object.assign(
  NewDividendButtonBase,
  {
    defaultProps: ButtonLink.defaultProps,
  }
);

type PlaceholderButtonType = StyledComponent<
  typeof NewDividendButton,
  ThemeInterface,
  any,
  'variant'
>;

export const PlaceholderButtonBase: PlaceholderButtonType = styled(
  NewDividendButton
)`
  width: 300px;
  height: 370px;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:not([disabled]):hover {
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const PlaceholderButton: PlaceholderButtonType = Object.assign(
  PlaceholderButtonBase,
  {
    defaultProps: NewDividendButton.defaultProps,
  }
);
