import { styled, Heading, ThemeInterface } from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

export const DividendHeading: StyledComponent<
  typeof Heading,
  ThemeInterface,
  any,
  'variant'
> = styled(Heading).attrs({
  variant: 'h2',
})`
  width: 100%;
  word-wrap: break-word;
`;
