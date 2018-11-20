// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import {
  Toaster,
  TxModal,
  ConfirmModal,
  NoticeBar,
  Navbar,
  Footer,
  EnterPINModal,
  StickyTop,
  getNotice,
} from '@polymathnetwork/ui';

import type { RootState } from '../redux/reducer';

type StateProps = {|
  network: any,
  isFetching: boolean,
  isFetchingLegacyTokens: boolean,
  ticker: ?string,
|};

type DispatchProps = {|
  getNotice: (scope: string) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isFetching: state.pui.common.isFetching,
  isFetchingLegacyTokens: state.token.isFetchingLegacyTokens,
  ticker: state.token.token ? state.token.token.ticker : null,
});

const mapDispatchToProps: DispatchProps = {
  getNotice,
};

type Props = {|
  children: Node,
|} & StateProps &
  DispatchProps;

class App extends Component<Props> {
  componentDidMount() {
    this.props.getNotice('issuers');
  }

  render() {
    const { children, ticker, isFetching, isFetchingLegacyTokens } = this.props;

    return (
      <Fragment>
        {isFetching || isFetchingLegacyTokens ? <Loading /> : ''}
        <Toaster />
        <TxModal />
        <EnterPINModal />
        <ConfirmModal />
        <StickyTop>
          <NoticeBar />
          <Navbar ticker={ticker} />
        </StickyTop>
        {children}
        <Footer />
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
