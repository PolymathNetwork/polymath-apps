import { styled } from '~/styles';
import { IconButton } from '~/components/IconButton';
import {
  Tooltip as TooltipComponent,
  TooltipProps,
} from '~/components/Tooltip';
import { ReactNode } from 'react';

export const Icon = styled(IconButton)`
  transition: ${({ theme }) => `color ${theme.transitions.hover.ms}ms`};
  color: ${({ theme }) => theme.colors.blue[1]};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

/**
 * NOTE @monitz87: this is needed because styled components ignores the children
 * prop for some reason
 */
interface Props extends TooltipProps {
  children?: ReactNode;
}

export const Tooltip = styled(TooltipComponent)<Props>`
  max-width: 15rem;
  background-color: white;
  padding: 1rem;
  border: 1px solid #dfe3e6;
  word-wrap: break-word;
  font-weight: normal;
  line-height: 21px;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
`;
