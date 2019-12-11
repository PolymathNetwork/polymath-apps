import React, { Component } from 'react';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { Link } from 'react-router-dom';

export default class TickerCard extends Component {
  render() {
    const { ticker } = this.props;
    return (
      <div className="token-symbol-wrapper">
        <div className="pui-page-box">
          <h3>Continue to configure security token</h3>
          <div style={{ height: '140px' }} />
          <br />
          <Link to="/ticker">
            <Button kind="secondary" className="export-tokens-list-btn">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
