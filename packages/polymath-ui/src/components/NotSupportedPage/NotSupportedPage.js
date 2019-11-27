import React, { Component } from 'react';
import { Button } from 'carbon-components-react';

import Page from '../Page';
import logo from '../../images/logo.svg';
import illustration from '../../images/illustration.png';

import './style.scss';

export default class NotSupportedPage extends Component {
  render() {
    return (
      <Page title="Polymath">
        <div className="bx--row">
          <div className="bx--col-xs-12 dummy-page">
            <img src={logo} alt="Logo" className="logo-dark" />
            <img src={illustration} alt="Illustration" />
            <h3>
              The configuration of your security token requires interaction with
              the <span>MetaMask</span> browser extension. Please use your
              desktop browser to proceed with this operation
            </h3>
            <p>
              <a href="https://polymath.network">
                <Button icon="arrow--left">Back to The Homepage</Button>
              </a>
            </p>
          </div>
        </div>
      </Page>
    );
  }
}
