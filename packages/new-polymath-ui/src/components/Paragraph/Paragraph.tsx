import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Text } from '~/components/Text';

type TextProps = typeHelpers.GetProps<typeof Text>;

export interface Props extends TextProps {}

export const Paragraph = styled(Text)<Props>`
  &:last-child {
    margin-bottom: 0;
  }
`;

Paragraph.defaultProps = {
  ...Text.defaultProps,
  as: 'p',
  mt: 0,
  mb: 'm',
};
