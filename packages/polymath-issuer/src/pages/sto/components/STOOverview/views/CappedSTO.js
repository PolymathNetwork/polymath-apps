// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import type {
  SecurityToken,
  STOPurchase,
  STODetails,
} from '@polymathnetwork/js/types';
import { Page, NotFoundPage, STOStatus } from '@polymathnetwork/ui';

import {
  togglePauseSto,
  exportInvestorsList,
} from '../../../../../actions/sto';
import type { RootState } from '../../../../../redux/reducer';

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>,
  isStoPaused: boolean,
|};

type DispatchProps = {|
  togglePauseSto: (endDate: Date) => any,
  exportInvestorsList: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
  isStoPaused: state.sto.pauseStatus,
});

const mapDispatchToProps: DispatchProps = {
  togglePauseSto,
  exportInvestorsList,
};

type Props = {||} & StateProps & DispatchProps;

class OverviewSTO extends Component<Props> {
  handlePause = () => {
    // $FlowFixMe
    this.props.togglePauseSto();
  };

  handleExport = () => {
    this.props.exportInvestorsList();
  };

  render() {
    const { token, details } = this.props;
    if (!token || !details) {
      return <NotFoundPage />;
    }
    return (
      <Page title={`${token.ticker} STO Overview – Polymath`}>
        <div>
          <Fragment>
            <h1 className="pui-h1">Security Token Overview</h1>
            <br />
            <STOStatus // eslint-disable-next-line react/jsx-handler-names
              toggleStoPause={this.handlePause}
              details={details}
              token={token}
              isStoPaused={this.props.isStoPaused}
            />
            <Button
              icon="download"
              kind="secondary"
              onClick={this.handleExport}
              style={{
                float: 'left',
                marginTop: '-60px',
                marginLeft: '25px',
              }}
            >
              Export List Of Investors
            </Button>
          </Fragment>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewSTO);
