import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { ulReset } from '~/styles/utils';
import { Flex } from '~/components/Flex';

type FlexProps = typeHelpers.GetProps<typeof Flex>;

export interface Props extends FlexProps {
  vertical?: boolean;
}

export const List = styled(Flex)<Props>`
  ${ulReset}
  flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};

  > * + * {
    ${({ vertical, theme }) =>
      vertical
        ? `margin-top: ${theme.space.gridGap};`
        : `margin-left: ${theme.space.gridGap};`}
  }
`;

List.defaultProps = {
  as: 'ul',
  alignItems: 'center',
};
