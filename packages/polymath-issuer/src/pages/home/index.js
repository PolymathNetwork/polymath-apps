import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { connect } from 'react-redux';

class HomePage extends Component {
  render() {
    return (
      <PageCentered title="Polymath" justifyContent="start">
        <Toaster />
        <div className="splash-background-pattern" />
        <div className="splash-background" />
        <div>
          <h1 className="pui-h0">
            Start Your Security Token
            <br />
            Journey Here
          </h1>
          <h3 className="pui-h3">
            Easily reserve your ticker, mint your tokens, and <br />
            prepare distribution of your STO.
          </h3>
          <br />
          <br />
          <p>
            <Link to="/account">
              <Button id="create-token-btn" icon="arrow--right">
                Connect Metamask
              </Button>
            </Link>
          </p>
        </div>
      </PageCentered>
    );
  }
}

export default connect()(HomePage);
