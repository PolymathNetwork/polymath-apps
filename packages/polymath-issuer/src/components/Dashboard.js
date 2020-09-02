// @flow

import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

// eslint-disable-next-line no-unused-vars
import {
  Sidebar,
  icoBriefcase,
  icoInbox,
  icoHandshake,
  icoWhitelist,
  icoDividends,
  icoRestriction,
  NotFoundPage,
} from '@polymathnetwork/ui';
import type { SecurityToken, Address } from '@polymathnetwork/js/types';

import { isProvidersPassed } from '../pages/providers/data';

import { fetch as fetchToken, fetchLegacyToken } from '../actions/token';
import { fetchProviders } from '../actions/providers';

import PausedBar from './PausedBar';

import type { RootState } from '../redux/reducer';
import type { ServiceProvider } from '../pages/providers/data';

import MigrateTokenPage from './MigrateTokenPage';

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
  providers: ?Array<ServiceProvider>,
  account: Address,
  legacyToken: ?{|
    ticker: string,
    address: string,
  |},
|};

type DispatchProps = {|
  fetchToken: (ticker: string) => any,
  fetchProviders: (ticker: string) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  isTokenFetched: state.token.isFetched,
  providers: state.providers.data,
  account: state.network.account,
  legacyToken: state.token.legacyToken,
});

const mapDispatchToProps: DispatchProps = {
  fetchToken,
  fetchProviders,
};

type Props = {|
  route: Object,
  match: {
    params: {
      id: string,
    },
  },
|} & StateProps &
  DispatchProps;

class Dashboard extends Component<Props> {
  componentDidMount() {
    const ticker = this.props.match.params.id;

    this.props.fetchToken(ticker);
    this.props.fetchProviders(ticker);
  }

  render() {
    const {
      isTokenFetched,
      providers,
      route,
      token,
      account,
      legacyToken,
    } = this.props;

    if (!isTokenFetched) {
      // TODO @bshevchenko: why is this here?
      // NOTE @monitz87: if you don't know, how do you expect us to?
      return <span />;
    }

    if (legacyToken) {
      return <MigrateTokenPage />;
    }

    // $FlowFixMe
    if (isTokenFetched && (token === null || token.owner !== account)) {
      return <NotFoundPage />;
    }

    // $FlowFixMe
    const ticker = token.ticker;
    const tokenUrl = `/dashboard/${ticker}`;
    const location = window.location.href;
    const topSidebarItems = [
      {
        title: 'Providers',
        id: 'providers-nav-link',
        icon: icoHandshake,
        to: `${tokenUrl}/providers`,
        isActive: location.slice(-10) === '/providers',
        isDisabled: false,
      },
      {
        title: 'Token',
        id: 'token-nav-link',
        icon: icoBriefcase,
        to: tokenUrl,
        isActive: location.slice(ticker.length * -1) === ticker,
        isDisabled: !isProvidersPassed(providers) && (!token || !token.address),
      },
      {
        title: 'STO',
        id: 'sto-nav-link',
        icon: icoInbox,
        to: `${tokenUrl}/sto`,
        isActive: location.slice(-4) === '/sto',
        isDisabled: !token || !token.address,
      },
      {
        title: 'Compliance',
        id: 'compliance-nav-link',
        icon: icoWhitelist,
        to: `${tokenUrl}/compliance`,
        isActive: location.slice(-11) === '/compliance',
        isDisabled: !token || !token.address,
      },
      // {
      //   title: 'Volume Restrictions',
      //   id: 'restriction-nav-link',
      //   icon: icoRestriction,
      //   to: `${tokenUrl}/restrictions`,
      //   isActive: location.slice(-13) === '/restrictions',
      //   // isDisabled: !token || !token.address,
      //   isDisabled: true,
      // },
      {
        title: 'Dividends',
        id: 'dividends-nav-link',
        icon: icoDividends,
        to: '/notfound', // `${tokenUrl}/dividends`,
        isActive:
          location.slice(-10) === '/dividends' ||
          location.includes('/checkpoints'),
        isDisabled: true, // !token || !token.address,
      },
    ];
    const bottomSidebarItems = [
      // {
      //   title: 'FAQ',
      //   icon: icoHelp,
      //   to: '#',
      //   isActive: false,
      // },
    ];
    return (
      <Fragment>
        <PausedBar />
        <Sidebar
          id="primary-nav"
          topItems={topSidebarItems}
          bottomItems={bottomSidebarItems}
        />
        {renderRoutes(route.routes)}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
