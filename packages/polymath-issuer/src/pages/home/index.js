import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { connect } from 'react-redux';

class HomePage extends Component {
  componentDidMount() {
    this.props.dispatch(
      notify(
        'Polymath is performing a system upgrade to the ERC-1400 Security Token Standard on Monday, July 29th. Please expect the Token Studio to be offline.',
        false,
        '',
        '',
        true
      )
    );
  }
  render() {
    return (
      <PageCentered title="Polymath" justifyContent="start">
        <Toaster />
        <div className="splash-background-pattern" />
        <div className="splash-background" />
        <div>
          <h1 className="pui-h0">
            The Next Mega-Trend
            <br />
            in Crypto is the Emergence
            <br /> of Securities Tokens
          </h1>
          <h3 className="pui-h3">
            Polymath enables trillions of dollars of securities to be issued
            <br /> and traded on the blockchain.
          </h3>
          <br />
          <br />
          <p>
            <Link to="/ticker">
              <Button id="create-token-btn" icon="arrow--right">
                Create your security token
              </Button>
            </Link>
          </p>
        </div>
      </PageCentered>
    );
  }
}

export default connect()(HomePage);
