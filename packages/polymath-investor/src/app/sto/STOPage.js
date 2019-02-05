// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import { STO } from '@polymathnetwork/js';
import { Page, STOStatus } from '@polymathnetwork/ui';
import type { SecurityToken, STODetails } from '@polymathnetwork/js';

import config from '../../config.json';
import PurchaseModal from './PurchaseModal';
import { fetch, purchasePrep } from './actions';
import type { RootState } from '../../redux/reducer';

import './style.scss';

type StateProps = {|
  token: ?SecurityToken,
  sto: ?STO,
  details: ?STODetails,
  isPaused: ?boolean,
|};

type DispatchProps = {|
  fetch: (ticker: string) => any,
  purchasePrep: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.sto.token,
  sto: state.sto.sto,
  details: state.sto.details,
  isPaused: state.sto.isPaused,
});

const mapDispatchToProps: DispatchProps = {
  fetch,
  purchasePrep,
};

type Props = {
  match: {
    params: {
      ticker: string,
    },
  },
} & StateProps &
  DispatchProps;

class STOPage extends Component<Props> {
  componentWillMount() {
    this.props.fetch(this.props.match.params.ticker);
  }

  handlePurchase = () => {
    this.props.purchasePrep();
  };

  render() {
    const { token, sto, details, isPaused } = this.props;
    const now = new Date();
    if (!token || !sto || !details) {
      return (
        <div className="pui-single-box">
          <h3 align="center" className="pui-h3">
            Token or STO not found. Please check your configuration.
          </h3>
        </div>
      );
    } // $FlowFixMe TODO @bshevchenko: props [1] is incompatible with empty [2]
    const purchaseModal = <PurchaseModal />;
    return (
      <Page title={`${token.ticker} STO – ` + config.title}>
        <div style={{ marginTop: '100px' }}>
          <h1 className="pui-h1">{token.ticker} Token STO</h1>
          <br />
          <STOStatus
            details={details}
            token={token}
            isStoPaused={!!isPaused}
            notPausable
          />
          {details.start <= now && details.end > now && !isPaused ? (
            <Button
              onClick={this.handlePurchase}
              style={{
                float: 'left',
                marginTop: '-65px',
                marginLeft: '25px',
              }}
            >
              Purchase Tokens
            </Button>
          ) : (
            ''
          )}
          {purchaseModal}
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(STOPage);
