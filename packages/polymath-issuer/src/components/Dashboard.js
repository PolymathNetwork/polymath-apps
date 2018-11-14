// @flow

import React, { Fragment, Component } from 'react';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import {
  Sidebar,
  icoBriefcase,
  icoInbox,
  icoHandshake,
  icoWhitelist,
  NotFoundPage,
} from '@polymathnetwork/ui';
import type { SecurityToken, Address } from '@polymathnetwork/js/types';

import { isProvidersPassed } from '../pages/providers/data';

import { fetch as fetchToken } from '../actions/token';
import { fetchProviders } from '../actions/providers';

import PausedBar from './PausedBar';

import type { RootState } from '../redux/reducer';
import type { ServiceProvider } from '../pages/providers/data';

type StateProps = {|
  token: ?SecurityToken,
  isTokenFetched: boolean,
  providers: ?Array<ServiceProvider>,
  account: Address,
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
  componentWillMount() {
    this.props.fetchToken(this.props.match.params.id);
    this.props.fetchProviders(this.props.match.params.id);
  }

  render() {
    const { isTokenFetched, providers, route, token, account } = this.props;

    if (!isTokenFetched) {
      // TODO @bshevchenko: why is this here?
      // NOTE @monitz87: if you don't know, how do you expect us to?
      return <span />;
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
