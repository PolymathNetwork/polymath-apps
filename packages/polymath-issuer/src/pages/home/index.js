import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { PageCentered, Flex, Button, logo } from '@polymathnetwork/ui';

export default class HomePage extends Component {
  render() {
    return (
      <PageCentered title="Polymath" justifyContent="start">
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
                CREATE YOUR SECURITY TOKEN
              </Button>
            </Link>
          </p>
        </div>
      </PageCentered>
    );
  }
}
