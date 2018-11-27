// @flow

import React, { Component } from 'react';
import { ActionModal, Paragraph } from '@polymathnetwork/ui';
import type { ServiceProvider } from './data';

type Props = {|
  isOpen: boolean,
  selected: boolean,
  providerInfo: ServiceProvider,
  onClose: () => any,
  onSubmit: () => any,
|};

export default class ProviderModal extends Component<Props> {
  handleSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    const { isOpen, providerInfo, onClose, onSubmit, selected } = this.props;
    return (
      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        isActionDisabled={selected}
        actionButtonText="Select"
        onSubmit={onSubmit}
      >
        <ActionModal.Header>{providerInfo.title}</ActionModal.Header>
        <ActionModal.Body>
          <img src={providerInfo.background} alt={providerInfo.title} />
          <Paragraph pt={3} fontSize={2}>
            {providerInfo.desc.split('\n').map(item => {
              return (
                <span>
                  {item}
                  <br />
                </span>
              );
            })}
          </Paragraph>
        </ActionModal.Body>
      </ActionModal>
    );
  }
}
