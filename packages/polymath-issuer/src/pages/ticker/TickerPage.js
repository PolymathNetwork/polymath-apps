// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Remark, bull, thousandsDelimiter } from '@polymathnetwork/ui';
import { SecurityTokenRegistry } from '@polymathnetwork/js';
import type { RouterHistory } from 'react-router';

import ReserveTickerForm from './components/ReserveTickerForm';
import { expiryLimit } from '../../actions/ticker';
import { data as tokenData } from '../../actions/token';

type StateProps = {|
  account: ?string,
  token: Object,
  expiryLimit: number,
|};

type DispatchProps = {|
  tokenData: (data: any) => any,
  getExpiryLimit: () => any,
|};

const mapStateToProps = (state): StateProps => ({
  account: state.network.account,
  token: state.token.token,
  expiryLimit: state.ticker.expiryLimit,
});

const mapDispatchToProps: DispatchProps = {
  tokenData,
  getExpiryLimit: expiryLimit,
};

type Props = {|
  history: RouterHistory,
|} & StateProps &
  DispatchProps;

type State = {|
  tickerRegistrationFee: string,
|};

class TickerPage extends Component<Props, State> {
  state = {
    tickerRegistrationFee: '-',
  };

  componentWillMount() {
    this.props.tokenData(null);
    this.props.getExpiryLimit();
    SecurityTokenRegistry.registrationFee().then(fee => {
      // $FlowFixMe
      this.setState({ tickerRegistrationFee: thousandsDelimiter(fee) });
    });
  }

  render() {
    return (
      <DocumentTitle title="Token Symbol Reservation – Polymath">
        <div id="ticker-reservation" className="pui-single-box">
          <div className="pui-single-box-header">
            <div className="pui-single-box-bull">
              <img src={bull} alt="Bull" />
            </div>
            <h1 className="pui-h1">Reserve Your Token Symbol</h1>
            <h4 className="pui-h4">
              Your token symbol will be reserved for {this.props.expiryLimit}{' '}
              days, and is permanently yours once you create your Token. This
              reservation ensures that no other organization can create a token
              symbol identical token to yours using the Polymath platform. This
              operation carries a cost of: {this.state.tickerRegistrationFee}{' '}
              POLY.
            </h4>
            <div className="pui-clearfix" />
            <Remark title="Note">
              If your organization has a CUSIP number, please enter the 5-letter
              symbol assigned to you by FINRA. Otherwise, please enter your
              desired token symbol provided that it does not infringe on
              registered trademarks.
            </Remark>
          </div>
          <ReserveTickerForm />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TickerPage);
