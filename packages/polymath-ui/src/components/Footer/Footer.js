import React, { Component } from 'react';
import styled from 'styled-components';

import PageWrap from '../PageWrap';
import Flex from '../Flex';

type Props = {|
  title?: string,
  termsOfService?: string,
  privacyPolicy?: string,
|};

const Container = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0 -1px 0 0 #dfe3e6;
  height: ${({ theme }) => theme.navbar.height};

  .pui-footer-links {
    margin-left: auto;
    display: inline-flex;

    li {
      display: inline-flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.lightText};
      font-size: 14px;
      line-height: 22px;
      margin-left: 30px;
      font-weight: 300;

      a {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.lightText};
      }
    }
  }

  .pui-footer-text {
    display: inline-flex;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: 14px;
    line-height: 22px;
    font-weight: 300;
  }
`;

const Inner = styled(Flex)`
  height: ${({ theme }) => theme.navbar.height};
`;

export default class Footer extends Component<Props> {
  render() {
    return (
      <Container>
        <PageWrap>
          <Inner>
            <p className="pui-footer-text">
              &copy; {new Date().getFullYear()} {this.props.title || 'Polymath'}
            </p>
            <ul className="pui-footer-links">
              <li>
                <a
                  href={
                    this.props.termsOfService ||
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
                    this.props.privacyPolicy ||
                    'https://polymath.network/privacypolicy.html'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Inner>
        </PageWrap>
      </Container>
    );
  }
}
