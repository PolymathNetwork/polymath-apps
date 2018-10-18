// @flow

import React from 'react';
import { Accordion, AccordionItem } from 'carbon-components-react';

import {
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_DISCONNECTED,
  ERROR_ACCESS_REQUESTED,
} from '../EthNetworkWrapper';
import AccessRequestedStatus from './status/AccessRequestedStatus';
import GenericStatus from './status/GenericStatus';

import logo from '../../images/logo.svg';

import './style.scss';

type Props = {|
  networks: string,
  status: number,
  onRequestAuth: Function,
|};

const Status = ({ status, onRequestAuth, networks }) => {
  switch (status) {
    case ERROR_LOCKED:
      return (
        <GenericStatus
          id="metamask-locked"
          title="Your MetaMask Is Locked"
          description="Simply open MetaMask and follow the instructions to unlock it."
        />
      );
    case ERROR_ACCESS_REQUESTED:
      return <AccessRequestedStatus onRequestAuth={onRequestAuth} />;
    case ERROR_NETWORK:
      return (
        <GenericStatus
          id="wrong-network"
          title="Wrong Network"
          description={
            <span>
              Network that you chose is not supported.
              <br />
              Open MetaMask and choose {networks}.
            </span>
          }
        />
      );
    case ERROR_DISCONNECTED:
      return (
        <GenericStatus
          id="disconnected"
          title="Aw, Snap!"
          description={
            <span>
              You were disconnected from the node for some reason. Please
              refresh the page.
            </span>
          }
        />
      );
    default:
      return (
        <GenericStatus
          id="no-metamask"
          title="You Need MetaMask"
          description={
            <span>
              MetaMask is a browser extension that links the operations
              performed on this dashboard with the blockchain. Please visit{' '}
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://metamask.io/
              </a>{' '}
              and install the MetaMask extension to your browser of choice.
            </span>
          }
        />
      );
  }
};

const MetamaskStatus = ({ networks, status, onRequestAuth }: Props) => (
  <div className="pui-metamask-status">
    <img src={logo} alt="Logo" className="pui-metamask-logo" />
    <div className="pui-single-box">
      <Status
        status={status}
        networks={networks}
        onRequestAuth={onRequestAuth}
      />
      <Accordion className="pui-metamask-accordion">
        <AccordionItem title="What software do you need to issue your Security Token?">
          <p>
            To issue your Security Token, you need to have MetaMask installed in
            your browser.
            <br />
            Additionally, in a wallet in your MetaMask account you need to have
            ETH and POLY.
          </p>
        </AccordionItem>
        <AccordionItem title="Why is MetaMask locked?">
          <p>
            MetaMask periodically locks itself for security reasons.
            <br />
            Please open the MetaMask extension in your browser and enter your
            password to unlock MetaMask.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
);

export default MetamaskStatus;
