import styled from '~/styles';

import { Flex } from '~/components/Flex';
console.log(Flex);
export const Wrapper = styled(Flex)`
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
`;

export const TxInfo = styled.div`
  flex-grow: 1;
`;
