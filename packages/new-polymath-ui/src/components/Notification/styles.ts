import { styled } from '~/styles';
import { Flex } from '~/components/Flex';
import { Notification } from './Notification';
import { typeHelpers } from '@polymathnetwork/new-shared';

type NotificationProps = typeHelpers.GetProps<typeof Notification>;

export const Wrapper = styled(Flex)<{ status: NotificationProps['status'] }>`
  border: 1px solid ${({ theme, status }) => theme.colors[status]};
  border-left-width: 5px;
  padding: ${({ theme }) => theme.space.s};
`;
