// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import {
  Toaster,
  TxModal,
  ConfirmModal,
  NoticeBar,
  Header,
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
  ui: any,
|};

type DispatchProps = {|
  getNotice: (scope: string) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isFetching: state.pui.common.isFetching,
  isFetchingLegacyTokens: state.token.isFetchingLegacyTokens,
  ticker: state.token.token ? state.token.token.ticker : null,
  ui: state.ui,
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
    const {
      children,
      ticker,
      ui,
      isFetching,
      isFetchingLegacyTokens,
    } = this.props;

    return (
      <Fragment>
        {isFetching || isFetchingLegacyTokens ? <Loading /> : ''}
        <Toaster />
        <TxModal />
        <EnterPINModal />
        <ConfirmModal />
        <StickyTop zIndex={'header'}>
          <NoticeBar />
          <Header ticker={ticker} variant={ui.header.variant} />
        </StickyTop>
        {children}
        <Footer variant={ui.footer.variant} />
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
