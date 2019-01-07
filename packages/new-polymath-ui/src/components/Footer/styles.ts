import styled, { css } from '~/styles';
import { textLinkInverted } from '~/styles/utils';
import { Flex } from '~/components/Flex';

import { FooterProps } from './Footer';

const variants = {
  default: {
    Wrapper: css`
      background-color: white;
      box-shadow: 0 -1px 0 0 #dfe3e6;
    `,
    Links: css`
      a {
        color: ${({ theme }) => theme.colors.baseText};
      }
    `,
  },
  transparent: {
    Wrapper: ``,
    Links: css`
      a {
        color: white;
      }
    `,
  },
};

export const Wrapper = styled.div<FooterProps>`
  width: 100%;
  height: ${({ theme }) => theme.footer.height};
  ${({ variant }) => variants[variant].Wrapper};

  .pui-footer-text {
    display: inline-flex;
    font-size: 14px;
    line-height: 22px;
    font-weight: 300;
  }
`;

export const Inner = styled(Flex)`
  height: ${({ theme }) => theme.footer.height};
`;

export const Links = styled('ul')<FooterProps>`
  margin-left: auto;
  display: inline-flex;
  ${({ variant }) => variants[variant].Links};

  li {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    margin-left: 30px;
    font-weight: 300;

    a {
      ${textLinkInverted};
    }
  }
`;
