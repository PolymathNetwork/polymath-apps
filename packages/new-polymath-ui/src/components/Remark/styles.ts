import { styled } from '~/styles';
import { Flex } from '~/components/Flex';

export const Content = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.gray[0]};
`;
