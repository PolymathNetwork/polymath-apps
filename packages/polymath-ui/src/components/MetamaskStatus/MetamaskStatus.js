// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Accordion, AccordionItem } from 'carbon-components-react';
import {
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_DISCONNECTED,
} from '@polymathnetwork/ui/components/EthNetworkWrapper';

import logo from '../../images/logo.svg';
import metamask from '../../images/metamask.png';

type StateProps = {|
  error: number,
|};

const mapStateToProps = (state): StateProps => ({
  error: state.network.error,
});

type Props = {|
  networks: string,
|} & StateProps;

class MetamaskPage extends Component<Props> {
  render() {
    let h1;
    let h3;
    const link = (
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        https://metamask.io/
      </a>
    );
    switch (Number(this.props.error)) {
      case ERROR_LOCKED:
        h1 = 'Your MetaMask Is Locked';
        h3 = 'Simply open MetaMask and follow the instructions to unlock it.';
        break;

      case ERROR_NETWORK:
        h1 = 'Wrong Network';
        h3 = (
          <span>
            Network that you chose is not supported.
            <br />
            Open MetaMask and choose {this.props.networks}.
          </span>
        );
        break;

      case ERROR_DISCONNECTED:
        h1 = 'Aw, Snap!';
        h3 = (
          <span>
            You were disconnected from the node for some reason. Please refresh
            the page.
          </span>
        );
        break;

      default:
        h1 = 'You Need MetaMask';
        h3 = (
          <span>
            MetaMask is a browser extension that links the operations performed
            on this dashboard with the blockchain. Please visit {link} and
            install the MetaMask extension to your browser of choice.
          </span>
        );
    }
    return (
      <DocumentTitle title="Polymath">
        <div>
          <img src={logo} alt="Logo" className="pui-metamask-logo" />
          <div className="pui-single-box">
            <div className="pui-single-box-header">
              <div className="pui-single-box-metamask">
                <img src={metamask} alt="Metamask" />
              </div>
              <h1 className="pui-h1">{h1}</h1>
              <h3 className="pui-h3">{h3}</h3>
            </div>
            <Accordion className="pui-metamask-accordion">
              <AccordionItem title="What software do you need to issue your Security Token?">
                <p>
                  To issue your Security Token, you need to have MetaMask
                  installed in your browser.
                  <br />
                  Additionally, in a wallet in your MetaMask account you need to
                  have ETH and POLY.
                </p>
              </AccordionItem>
              <AccordionItem title="Why is MetaMask locked?">
                <p>
                  MetaMask periodically locks itself for security reasons.
                  <br />
                  Please open the MetaMask extension in your browser and enter
                  your password to unlock MetaMask.
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps)(MetamaskPage);
