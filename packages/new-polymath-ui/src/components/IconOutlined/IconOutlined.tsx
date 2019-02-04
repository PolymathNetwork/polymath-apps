import styled from 'styled-components';
import { borderColor } from 'styled-system';

import { IconCircled, IconCircledProps } from '~/components/IconCircled';

export interface IconCircledProps extends IconCircledProps {}

export const IconOutlined = styled(IconCircled).attrs({
  bg: 'transparent',
})`
  border: 2px solid;
  ${({ color, theme }) => borderColor({ borderColor: color, theme })};
`;
