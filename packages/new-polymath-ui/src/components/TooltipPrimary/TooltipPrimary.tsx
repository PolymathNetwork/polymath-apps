import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { Tooltip } from '~/components/Tooltip';
import { FC, ReactNode } from 'react';

type TooltipProps = typeHelpers.GetProps<typeof Tooltip>;

/**
 * NOTE @monitz87: this is needed because styled components ignores the children
 * prop for some reason
 */
export interface Props extends TooltipProps {
  children?: ReactNode;
}

export const TooltipPrimary = styled(Tooltip)<Props>`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
`;
