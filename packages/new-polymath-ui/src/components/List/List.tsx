import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { ulReset } from '~/styles/utils';
import { Grid } from '~/components/Grid';

type FlexProps = typeHelpers.GetProps<typeof Grid>;

interface Props extends FlexProps {
  vertical?: boolean;
}

export const List = styled(Grid)<Props>`
  ${ulReset}
  grid-auto-flow: ${({ vertical }) => (vertical ? 'row' : 'column')};
`;

List.defaultProps = {
  ...Grid.defaultProps,
  as: 'ul',
  alignItems: 'center',
  gridAutoRows: 'minmax(min-content, max-content)',
  gridAutoColumns: 'minmax(min-content, max-content)',
};
