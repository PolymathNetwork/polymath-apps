import React from 'react';

import * as sc from './styles';

import { PageWrap } from '../PageWrap';

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
          <span className="pui-footer-text">
            &copy; {new Date().getFullYear()} {props.title || 'Polymath'}
          </span>
          <sc.Links className="pui-footer-links" variant={props.variant}>
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
          </sc.Links>
        </sc.Inner>
      </PageWrap>
    </sc.Wrapper>
  );
};

Footer.defaultProps = {
  variant: 'default',
};
