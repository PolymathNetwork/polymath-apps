import styled from '~/styles';

import { TextEllipsis } from '~/components/TextEllipsis';
import { Flex } from '~/components/Flex';

export const Wrapper = styled(Flex)`
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};

  & + & {
    margin-top: ${({ theme }) => theme.space.gridGap};
  }
`;

export const Label = styled.span`
  flex-shrink: 0;
`;

export const TxInfo = styled.div`
  flex-grow: 1;
`;
