import { styled } from '~/styles';
import { buttonReset } from '~/styles/utils';
import { Link } from '~/components/Link';

export const LinkButton = styled(Link).attrs({
  as: 'button',
})`
  ${buttonReset};
`;
