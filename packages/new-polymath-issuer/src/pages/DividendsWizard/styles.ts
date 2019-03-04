import {
  ProgressIndicator,
  ThemeInterface,
  styled,
} from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

export const WizardProgress: StyledComponent<
  React.ReactType<any>,
  ThemeInterface,
  any,
  never
> = styled(ProgressIndicator)`
  font-size: 20px;
`;
