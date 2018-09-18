// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Modal } from 'carbon-components-react';
import type { SecurityToken, STODetails } from 'polymathjs';

import PurchaseForm, { formName } from './PurchaseForm';
import { purchase, purchaseModalClose } from './actions';
import type { RootState } from '../../redux/reducer';

type StateProps = {|
  isOpen: boolean,
  token: SecurityToken,
  details: STODetails,
|};

type DispatchProps = {|
  purchase: () => any,
  purchaseModalClose: () => any,
  change: (formName: string, field: string, value: string) => void,
|};

type Props = {||} & StateProps & DispatchProps;

const mapStateToProps = (state: RootState) => ({
  token: state.sto.token,
  details: state.sto.details,
  isOpen: state.sto.isPurchaseModalOpen,
});

const mapDispatchToProps = {
  purchase,
  purchaseModalClose,
  change,
};

class PurchaseModal extends Component<Props> {
  handleClose = () => {
    this.props.purchaseModalClose();
  };

  handleSubmit = () => {
    this.props.purchase();
  };

  render() {
    const { isOpen, token, details } = this.props;
    const change = (field: string, value: string) => {
      this.props.change(formName, field, value);
    };
    return (
      <Modal
        open={isOpen}
        onRequestClose={this.handleClose}
        modalHeading={token.ticker + ' Token Purchase Details'}
        passiveModal
        className="purchase-modal"
      >
        <h4 className="pui-h4">
          Enter the amount of {token.ticker} tokens you would like to purchase
          or the amount of {details.isPolyFundraise ? 'POLY' : 'ETH'} you would
          like to invest.
        </h4>
        <br />
        <PurchaseForm
          onSubmit={this.handleSubmit}
          onClose={this.handleClose}
          change={change}
          details={details}
        />
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseModal);
