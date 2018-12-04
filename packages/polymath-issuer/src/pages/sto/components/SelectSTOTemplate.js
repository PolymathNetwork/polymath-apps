// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Heading, Page, Grid, Remark } from '@polymathnetwork/ui';

import STOTemplatesList from './STOTemplatesList';
import { useFactory } from '../../../actions/sto';

import type { Dispatch } from 'redux';
import type { SecurityToken, STOFactory } from '@polymathnetwork/js/types';
import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  token: ?SecurityToken,
  factories: Array<STOFactory>,
  dispatch: Dispatch<any>,
|};

const mapStateToProps = (state: RootState) => ({
  token: state.token.token,
  factories: state.sto.factories,
});

type Props = {||} & StateProps;

class SelectSTOTemplate extends Component<Props> {
  handleUseSTO = (sto: STOFactory) => () => {
    const { dispatch } = this.props;
    dispatch(useFactory(sto));
  };

  render() {
    const { token } = this.props;
    return (
      // $FlowFixMe
      <Page title={`Select ${token.ticker} STO Template – Polymath`}>
        <div>
          <div className="bx--row">
            <div className="bx--col-xs-12">
              <Remark title="Note">
                All smart contracts listed below were independently audited.
                Polymath does however recommend you select a Smart Contract
                Auditor to perform additional verification on the smart contract
                you selected.
              </Remark>
              <Heading as="h1" variant="h1">
                Security Token Offering Templates
              </Heading>
              <Heading variant="h4" mb="xl">
                Browse the STO templates below, and choose the template that
                best fits your needs.
                <br />
                To select the template you desire, press &laquo;SELECT AND
                CONFIGURE STO&raquo;.
              </Heading>
              <Grid gridGap={30} gridAutoFlow="row">
                <STOTemplatesList />
              </Grid>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(mapStateToProps)(SelectSTOTemplate);
