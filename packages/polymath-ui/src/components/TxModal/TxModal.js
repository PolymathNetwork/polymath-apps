// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading, Icon, Button } from 'carbon-components-react';

import Heading from '../Heading';
import Paragraph from '../Paragraph';
import Modal from '../Modal';

import { txContinue } from './actions';
import { etherscanTx } from '../../helpers';
import { icoPaperPlane } from '../../';
import type { RootState } from '../../redux/reducer';
import type { TxState } from './reducer';

import './style.scss';

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
    if (headingOverride && !error) {
      modalHeading = this.props.headingOverride;
    } else {
      modalHeading = error
        ? error.message
        : isFinished
        ? successTitle
        : 'Sign Transaction' + (Number(total) > 1 ? 's' : '');
    }
    let status = error ? 'alert' : isFinished ? 'success' : 'loading';
    let statusTitle = error
      ? 'Failed'
      : isFinished
      ? 'Completed'
      : 'Processing';

    return (
      <Modal
        className={
          'pui-tx-modal' +
          (isFinished ? ' pui-tx-success' : '') +
          (error ? ' pui-tx-failed' : '')
        }
        isOpen={!!total}
        isCloseable={false}
        status={status}
        maxWidth={500}
      >
        <Modal.Header status={status} label={'Transaction ' + statusTitle}>
          {modalHeading}
        </Modal.Header>

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
              <Heading as="h3" variant="h3" mb="s">
                {title}
              </Heading>
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
            <Paragraph fontSize={2}>
              We just sent you an email with the transaction details for your
              records. Check your inbox.
            </Paragraph>
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
