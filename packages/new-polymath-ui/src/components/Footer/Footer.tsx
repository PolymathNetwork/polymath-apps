import React from 'react';

import { PageWrap } from '~/components/PageWrap';
import { Link } from '~/components/Link';
import { Paragraph } from '~/components/Paragraph';
import * as sc from './styles';

export interface FooterProps {
  title?: string;
  termsOfService?: string;
  privacyPolicy?: string;
  variant: 'default' | 'transparent';
}

export const Footer = (props: FooterProps) => {
  return (
    <sc.Wrapper className="pui-footer" variant={props.variant}>
      <PageWrap>
        <sc.Inner>
          <Paragraph as="span" mb={0}>
            &copy; {new Date().getFullYear()} {props.title || 'Polymath'}
          </Paragraph>
          <sc.Links variant={props.variant}>
            <li>
              <Link
                href={
                  props.termsOfService ||
                  'https://polymath.network/termsofservice.html'
                }
              >
                Terms Of Service
              </Link>
            </li>
            <li>
              <Link
                href={
                  props.privacyPolicy ||
                  'https://polymath.network/privacypolicy.html'
                }
              >
                Privacy Policy
              </Link>
            </li>
          </sc.Links>
        </sc.Inner>
      </PageWrap>
    </sc.Wrapper>
  );
};

Footer.defaultProps = {
  variant: 'default',
};
