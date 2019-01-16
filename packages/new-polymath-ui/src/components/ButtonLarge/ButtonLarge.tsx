import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Button } from '~/components/Button';

type ButtonLargeProps = typeHelpers.GetProps<typeof Button>;

export const ButtonLarge = styled(Button)<ButtonLargeProps>`
  min-width: 150px;
`;
