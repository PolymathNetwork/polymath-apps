// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import type { RouterHistory } from 'react-router-dom';

import {
  Toaster,
  TxModal,
  ConfirmModal,
  Header,
  Footer,
  EnterPINModal,
  setupHistory,
} from '@polymathnetwork/ui';

type StateProps = {
  isFetching: boolean,
};

type DispatchProps = {|
  setupHistory: (history: RouterHistory) => any,
|};

const mapStateToProps = (state): StateProps => ({
  isFetching: state.pui.common.isFetching,
});

const mapDispatchToProps: DispatchProps = {
  setupHistory,
};

type Props = {|
  history: RouterHistory,
  ticker?: string,
  logo?: string,
  title?: string,
  termsOfService?: string,
  privacyPolicy?: string,
|} & StateProps &
  DispatchProps;

class PolymathUI extends Component<Props> {
  componentWillMount() {
    this.props.setupHistory(this.props.history);
  }

  render() {
    const { ticker, logo, title, termsOfService, privacyPolicy } = this.props;
    return (
      <div>
        <Header ticker={ticker} logo={logo} />
        <Toaster />
        <TxModal />
        <EnterPINModal />
        <ConfirmModal />
        <Footer
          title={title}
          termsOfService={termsOfService}
          privacyPolicy={privacyPolicy}
        />
        {this.props.isFetching ? <Loading /> : ''}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PolymathUI);
