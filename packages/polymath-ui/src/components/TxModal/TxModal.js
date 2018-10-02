// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Loading, Icon, Button } from 'carbon-components-react';

import { txContinue } from './actions';
import { etherscanTx } from '../../helpers';
import { icoPaperPlane } from '../../';
import type { RootState } from '../../redux/reducer';
import type { TxState } from './reducer';

type DispatchProps = {|
  txContinue: () => any,
|};

const mapStateToProps = (state: RootState): TxState => state.pui.tx;

const mapDispatchToProps: DispatchProps = {
  txContinue,
};

class TxModal extends Component<DispatchProps & TxState> {
  handleContinue = () => {
    this.props.txContinue();
  };

  // eslint-disable-next-line
  render() {
    const current = Number(this.props.current);
    const {
      total,
      error,
      isFinished,
      hashes,
      titles,
      successTitle,
      headingOverride,
    } = this.props;

    let modalHeading;
    if (headingOverride) {
      modalHeading = this.props.headingOverride;
    } else {
      modalHeading = error
        ? error.message
        : isFinished
          ? successTitle
          : 'Sign Transaction' + (Number(total) > 1 ? 's' : '');
    }

    return (
      <Modal
        className={
          'pui-tx-modal' +
          (isFinished ? ' pui-tx-success' : '') +
          (error ? ' pui-tx-failed' : '')
        }
        open={!!total}
        passiveModal
        modalHeading={modalHeading}
        modalLabel={
          'Transaction ' +
          (isFinished ? 'Completed' : '') +
          (error ? 'Failed' : '') +
          (!isFinished && !error ? 'Processing' : '')
        }
      >
        <div className="pui-tx-animation" />

        {titles.map((title: string, i: number) => (
          <div
            key={title}
            className={'pui-tx-row' + (i > current ? ' pui-tx-next' : '')}
          >
            <div className="pui-tx-icon">
              {current === i ? (
                error ? (
                  <Icon name="close" fill="#E71D32" width="32" height="32" />
                ) : (
                  <Loading withOverlay={false} />
                )
              ) : i < current ? (
                <Icon name="checkmark" fill="#00AA5E" width="32" height="24" />
              ) : (
                ''
              )}
            </div>
            <div className="pui-tx-info">
              <h3 className="pui-h3">{title}</h3>
              <div className="pui-tx-details">
                Transaction details on Etherscan:&nbsp;
                {hashes[i] ? etherscanTx(hashes[i]) : '...'}
              </div>
            </div>
          </div>
        ))}

        {isFinished && !this.props.isNoEmail ? (
          <div className="pui-tx-row pui-tx-email">
            <div className="pui-tx-icon">{icoPaperPlane}</div>
            <div className="pui-tx-details">
              <h4 className="pui-h4">
                We just sent you an email with the transaction details for your
                records. Check your inbox.
              </h4>
            </div>
          </div>
        ) : (
          ''
        )}

        <p className="pui-tx-continue">
          {isFinished || error ? (
            <Button onClick={this.handleContinue}>
              {this.props.continueLabel || 'Continue'}
            </Button>
          ) : (
            ''
          )}
        </p>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TxModal);
