import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { Tooltip } from '~/components/Tooltip';

type TooltipProps = typeHelpers.GetProps<typeof Tooltip>;

export interface Props extends TooltipProps {}

export const TooltipPrimary = styled(Tooltip)<Props>`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
`;
