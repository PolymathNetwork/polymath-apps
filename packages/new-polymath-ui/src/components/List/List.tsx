import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { ulReset } from '~/styles/utils';
import { Grid } from '~/components/Grid';

type FlexProps = typeHelpers.GetProps<typeof Grid>;

interface Props extends FlexProps {
  horizontal?: boolean;
}

export const List = styled(Grid).attrs<Props>(({ horizontal }) => ({
  gridAutoRows: !horizontal && 'minmax(min-content, max-content)',
  gridAutoColumns: horizontal && 'minmax(min-content, max-content)',
  gridAutoFlow: horizontal ? 'column' : 'row',
}))<Props>`
  ${ulReset}
`;

List.defaultProps = {
  ...Grid.defaultProps,
  as: 'ul',
  alignItems: 'center',
  horizontal: false,
};
