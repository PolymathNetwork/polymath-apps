import styled from 'styled-components';
import { borderColor } from 'styled-system';
import { IconCircled } from '~/components/IconCircled';

export const IconOutlined = styled(IconCircled).attrs({
  bg: 'transparent',
})`
  border-style: solid;
  border-width: ${({ borderWidth, theme }) => borderWidth};
  ${({ color, theme }) => borderColor({ borderColor: color, theme })};
`;

IconOutlined.defaultProps = {
  borderWidth: '2px',
};
