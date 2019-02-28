import { styled, ButtonLink, ThemeInterface } from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

export const NewDividendButton: StyledComponent<
  typeof ButtonLink,
  ThemeInterface,
  {},
  never
> = styled(ButtonLink)`
  flex-direction: column;
  align-items: center;
`;

export const PlaceholderButton: StyledComponent<
  typeof NewDividendButton,
  ThemeInterface,
  any,
  'variant'
> = styled(NewDividendButton).attrs({
  variant: 'ghost',
  iconPosition: 'top',
})`
  width: 300px;
  height: 370px;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.primary};
`;
