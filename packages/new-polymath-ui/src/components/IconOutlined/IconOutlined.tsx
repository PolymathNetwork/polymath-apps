import styled from 'styled-components';
import { borderColor } from 'styled-system';
import { IconCircled } from '~/components/IconCircled';

export const IconOutlined = styled(IconCircled).attrs({
  bg: 'transparent',
  scale: 0.9,
})`
  border: 2px solid;
  ${({ color, theme }) => borderColor({ borderColor: color, theme })};
`;
