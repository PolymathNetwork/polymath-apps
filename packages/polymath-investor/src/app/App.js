// @flow
import React, { Component } from 'react';
import Contract from '@polymathnetwork/js';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import {
  PolymathUI,
  txHash,
  txEnd,
  getNotice,
  fetchBalance,
} from '@polymathnetwork/ui';
import type { RouterHistory } from 'react-router-dom';

import Root from './Root';
import config from '../config.json';
import type { RootState } from '../redux/reducer';

type StateProps = {|
  network: any,
|};

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  getNotice: (scope: string) => any,
  fetchBalance: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
});

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  getNotice,
  fetchBalance,
};

type Props = {|
  route: Object,
  history: RouterHistory,
|} & StateProps &
  DispatchProps;

class App extends Component<Props> {
  componentWillMount() {
    Contract.setParams({
      ...this.props.network,
      txHashCallback: hash => this.props.txHash(hash),
      txEndCallback: receipt => this.props.txEnd(receipt),
    });
    this.props.fetchBalance();
    this.props.getNotice('investors');
  }

  render() {
    const { history } = this.props;
    const polymathUI = ( // $FlowFixMe TODO @bshevchenko: props [1] is incompatible with empty [2]
      <PolymathUI
        history={history}
        ticker={config.ticker}
        logo={config.logo}
        title={config.title}
        termsOfService={config.termsOfService}
        privacyPolicy={config.privacyPolicy}
      />
    );
    return (
      <Root>
        {polymathUI}
        {renderRoutes(this.props.route.routes)}
      </Root>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
