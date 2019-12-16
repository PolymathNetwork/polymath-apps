import React, { Component } from 'react';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { Link } from 'react-router-dom';

export default class TickerCard extends Component {
  render() {
    const { ticker } = this.props;
    return (
      <div className="token-symbol-wrapper">
        <div className="pui-page-box">
          <div className="ticker-field">
            <div className="bx--form-item">
              <label htmlFor="ticker" className="bx--label">
                Token Symbol
              </label>
              <input
                type="text"
                name="ticker"
                value={ticker}
                id="ticker"
                readOnly
                className="bx--text-input bx--text__input"
              />
            </div>
          </div>
          <br />
          <Link to={`/dashboard/${ticker}`}>
            <Button kind="secondary" className="export-tokens-list-btn">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
