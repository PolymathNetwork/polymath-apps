import { styled, Heading, ThemeInterface } from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

export const DividendHeading: StyledComponent<
  typeof Heading,
  ThemeInterface,
  any,
  'variant'
> = styled(Heading)`
  width: 100%;
  word-wrap: break-word;
`;
