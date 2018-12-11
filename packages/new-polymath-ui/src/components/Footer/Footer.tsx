import React from 'react';
import styled, { css } from 'styled-components';

import { PageWrap } from '../PageWrap';
import { Flex } from '../Flex';

import { textLinkInverted } from '../../styles/utils';

type Variants = {
  default: any;
  transparent: any;
};

const variants: Variants = {
  default: {
    Container: css`
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
    Links: css`
      a {
        color: white;
      }
    `,
  },
};

export interface FooterProps {
  title?: string;
  termsOfService?: string;
  privacyPolicy?: string;
  variant: keyof Variants;
}

const Container = styled.div<FooterProps>`
  width: 100%;
  height: ${({ theme }) => theme.footer.height};
  ${({ variant }) => variants[variant].Container};

  .pui-footer-text {
    display: inline-flex;
    font-size: 14px;
    line-height: 22px;
    font-weight: 300;
  }
`;

const Inner = styled(Flex)`
  height: ${({ theme }) => theme.footer.height};
`;

const Links = styled.ul<FooterProps>`
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

export const Footer = (props: FooterProps) => {
  return (
    <Container className="pui-footer" variant={props.variant}>
      <PageWrap>
        <Inner>
          <span className="pui-footer-text">
            &copy; {new Date().getFullYear()} {props.title || 'Polymath'}
          </span>
          <Links className="pui-footer-links" variant={props.variant}>
            <li>
              <a
                href={
                  props.termsOfService ||
                  'https://polymath.network/termsofservice.html'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms Of Service
              </a>
            </li>
            <li>
              <a
                href={
                  props.privacyPolicy ||
                  'https://polymath.network/privacypolicy.html'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
          </Links>
        </Inner>
      </PageWrap>
    </Container>
  );
};

Footer.defaultProps = {
  variant: 'default',
};
