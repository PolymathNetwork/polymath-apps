import { styled } from '~/styles';
import { Card } from '../Card';

const statusBarHeight = '8px';

export const Wrapper = styled(Card)<{ status: string }>`
  overflow: hidden;

  &:before {
    display: block;
    content: ' ';
    background-color: ${({ theme, status }) => theme.colors[status]};
    width: 100%;
    height: ${statusBarHeight};
  }
`;
