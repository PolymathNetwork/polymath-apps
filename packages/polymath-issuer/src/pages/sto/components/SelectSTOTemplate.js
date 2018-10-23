// @flow

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Grid, Remark } from '@polymathnetwork/ui';
import type { SecurityToken, STOFactory } from '@polymathnetwork/js/types';

import Progress from '../../token/components/Progress';
// import STODetails from './STODetails';
import STOTemplatesList from './STOTemplatesList';
import { fetchFactories, useFactory } from '../../../actions/sto';

import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  token: ?SecurityToken,
  factories: Array<STOFactory>,
|};

type DispatchProps = {|
  fetchFactories: () => any,
  useFactory: (factory: STOFactory) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  factories: state.sto.factories,
});

const mapDispatchToProps: DispatchProps = {
  fetchFactories,
  useFactory,
};

type Props = {||} & StateProps & DispatchProps;

class SelectSTOTemplate extends Component<Props> {
  handleUseSTO = (sto: STOFactory) => () => this.props.useFactory(sto);

  render() {
    const { token } = this.props;
    return (
      // $FlowFixMe
      <DocumentTitle title={`Select ${token.ticker} STO Template – Polymath`}>
        <div>
          <Progress />
          <div className="bx--row">
            <div className="bx--col-xs-12">
              <Remark title="Note">
                All smart contracts listed below were independently audited.
                Polymath does however recommend you select a Smart Contract
                Auditor to perform additional verification on the smart contract
                you selected.
              </Remark>
              <h1 className="pui-h1">Security Token Offering Templates</h1>
              <h3 className="pui-h3">
                Browse the STO templates below, and choose the template that
                best fits your needs.
                <br />
                To select the template you desire, press &laquo;SELECT AND
                CONFIGURE STO&raquo;.
              </h3>
              <br />
              <Grid gridGap={30} gridAutoFlow="row">
                <STOTemplatesList />
              </Grid>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectSTOTemplate);
