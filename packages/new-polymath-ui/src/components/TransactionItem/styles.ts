import styled from '~/styles';

import { Flex } from '~/components/Flex';

export const Wrapper = styled(Flex)`
  & + & {
    margin-top: ${({ theme }) => theme.space.gridGap};
  }
`;

export const Label = styled.span`
  flex-shrink: 0;
`;

export const Info = styled.div`
  flex-grow: 1;
`;
