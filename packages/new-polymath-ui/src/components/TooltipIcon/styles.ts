import { styled } from '~/styles';
import { IconButton } from '~/components/IconButton';
import { Tooltip as TooltipComponent } from '~/components/Tooltip';

export const Icon = styled(IconButton)`
  transition: ${({ theme }) => `color ${theme.transitions.hover.ms}ms`};
  color: ${({ theme }) => theme.colors.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.blue[0]};
  }
`;

export const Tooltip = styled(TooltipComponent)`
  max-width: 15rem;
  background-color: white;
  padding: 1rem;
  border: 1px solid #dfe3e6;
  word-wrap: break-word;
  font-weight: normal;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
`;
