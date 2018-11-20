// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

import PageWrap from '../PageWrap';
import Flex from '../Flex';
import Block from '../Block';

import { thousandsDelimiter, addressShortifier } from '../../helpers';

import polyLogo from '../../images/logo.svg';
import networkIcon from '../../images/icons/network.svg';
import polyIcon from '../../images/icons/poly.svg';
import accountIcon from '../../images/icons/account.svg';
import tokenIcon from '../../images/icons/token.svg';

import type { RootState } from '../../redux/reducer';

import './style.scss';

type StateProps = {|
  network: string,
  account: string,
  balance: ?BigNumber,
  isNotice: boolean,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network.name,
  account: state.network.account,
  balance: state.pui.account.balance,
  isNotice: state.pui.notice.isOpen,
});

type Props = {|
  ticker: ?string,
  logo: ?string,
|} & StateProps;

const Container = styled(Flex)`
  height: ${({ theme }) => theme.navbar.height};
`;

class Navbar extends Component<Props> {
  render() {
    const { balance, account, network, ticker, logo } = this.props;
    return (
      <div className="pui-navbar">
        <PageWrap>
          <Container>
            <Link to="/">
              {logo ? (
                <Block as="img" src={logo} alt="Company Logo" width="188" />
              ) : (
                <Block as="img" src={polyLogo} alt="Polymath" width="188" />
              )}
            </Link>
            {account ? (
              <Flex as="ul" ml="auto" className="pui-navbar-menu">
                <li>
                  <img
                    src={networkIcon}
                    alt="Active network"
                    style={{ marginRight: '2px' }}
                  />
                  {network}
                </li>
                <li>
                  <img src={polyIcon} alt="Your POLY balance" />
                  {balance
                    ? thousandsDelimiter(
                        new BigNumber(balance).integerValue()
                      ) + ' POLY'
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
          </Container>
        </PageWrap>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Navbar);
