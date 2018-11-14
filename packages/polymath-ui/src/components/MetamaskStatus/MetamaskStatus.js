// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'carbon-components-react';

import {
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_DISCONNECTED,
} from '../EthNetworkWrapper';

import PageCentered from '../PageCentered';
import ContentBox from '../ContentBox';

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

class MetamaskStatus extends Component<Props> {
  render() {
    let pageId;
    let h1;
    let h3;
    const link = (
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        https://metamask.io/
      </a>
    );
    switch (Number(this.props.error)) {
      case ERROR_LOCKED:
        pageId = 'metamask-locked';
        h1 = 'Your MetaMask Is Locked';
        h3 = 'Simply open MetaMask and follow the instructions to unlock it.';
        break;

      case ERROR_NETWORK:
        pageId = 'wrong-network';
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
        pageId = 'disconnected';
        h1 = 'Aw, Snap!';
        h3 = (
          <span>
            You were disconnected from the node for some reason. Please refresh
            the page.
          </span>
        );
        break;

      default:
        pageId = 'no-metamask';
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
      <PageCentered title="Polymath" id={pageId}>
        <ContentBox maxWidth={735}>
          <img src={logo} alt="Logo" className="pui-metamask-logo" />
          <div>
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
        </ContentBox>
      </PageCentered>
    );
  }
}

export default connect(mapStateToProps)(MetamaskStatus);
