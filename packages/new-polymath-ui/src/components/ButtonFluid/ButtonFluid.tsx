import styled, { StyledComponent } from 'styled-components';
import { Button } from '~/components/Button';
import { ThemeInterface } from '~/styles';

const ButtonFluidBase: StyledComponent<
  typeof Button,
  ThemeInterface,
  {},
  never
> = styled(Button)`
  width: 100%;
`;

export const ButtonFluid = Object.assign(ButtonFluidBase, {
  defaultProps: Button.defaultProps,
});
