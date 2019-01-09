import styled, { css } from '~/styles';
import { Flex } from '../Flex';

import { HeaderProps } from './Header';

const variants = {
  default: css`
    background-color: white;
    box-shadow: 0 1px 0 0 #dfe3e6;
  `,
  transparent: ``,
};

export const Wrapper = styled.div<{ variant: HeaderProps['variant'] }>`
  width: 100%;
  height: ${({ theme }) => theme.header.height};
  ${({ variant }) => variants[variant]};

  > a {
    float: left;
  }

  .pui-header-menu {
    li {
      display: inline-flex;
      align-items: center;
      color: $poly-gray-dark;
      font-size: 14px;
      line-height: 22px;
      margin-left: 30px;
      font-weight: 300;

      svg,
      img {
        margin-right: 8px;
      }
    }
  }
`;

export const Inner = styled(Flex)`
  height: ${({ theme }) => theme.header.height};
`;
