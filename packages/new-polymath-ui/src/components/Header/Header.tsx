import React from 'react';
import styled, { css } from 'styled-components';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';

import { PageWrap } from '../PageWrap';
import { Flex } from '../Flex';
import { Block } from '../Block';

import { thousandsDelimiter, addressShortifier } from '../../helpers';

import polyLogo from '../../images/logo.svg';
import networkIcon from '../../images/icons/network.svg';
import polyIcon from '../../images/icons/poly.svg';
import accountIcon from '../../images/icons/account.svg';
import tokenIcon from '../../images/icons/token.svg';

export interface HeaderProps {
  network: string;
  account: string;
  balance?: BigNumber;
  isNotice: boolean;
  variant?: string;
  ticker?: string;
  logo?: string;
}

const Container = styled.div`
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

const Inner = styled(Flex)`
  height: ${({ theme }) => theme.header.height};
`;

const variants = {
  default: css`
    background-color: white;
    box-shadow: 0 1px 0 0 #dfe3e6;
  `,
  transparent: css``,
};

export const Header = (props: HeaderProps) => {
  const { balance, account, network, ticker, logo, variant } = props;
  return (
    <Container className="pui-header" variant={variant}>
      <PageWrap>
        <Inner>
          <Link to="/">
            {logo ? (
              <Block as="img" src={logo} alt="Company Logo" width="188" />
            ) : (
              <Block as="img" src={polyLogo} alt="Polymath" width="188" />
            )}
          </Link>
          {account ? (
            <Flex as="ul" ml="auto" className="pui-header-menu">
              <li>
                <img
                  src={networkIcon}
                  alt="Active network"
                  style={{
                    marginRight: '2px',
                  }}
                />
                {network}
              </li>
              <li>
                <img src={polyIcon} alt="Your POLY balance" />
                {balance
                  ? thousandsDelimiter(new BigNumber(balance).integerValue()) +
                    ' POLY'
                  : '...'}
              </li>
              <li>
                <img src={accountIcon} alt="Account" />
                {addressShortifier(account)}
              </li>
              {ticker ? (
                <li>
                  <img src={tokenIcon} alt="Token" />
                  {ticker}
                </li>
              ) : (
                ''
              )}
            </Flex>
          ) : null}
        </Inner>
      </PageWrap>
    </Container>
  );
};

Header.defaultProps = {
  variant: 'default',
};
