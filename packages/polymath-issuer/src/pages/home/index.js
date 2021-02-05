import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { Accordion, AccordionItem, Tile } from 'carbon-components-react';
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
          <Accordion>
            <AccordionItem title="Token Studio capabilities and usage fees">
              <table>
                <tr>
                  <td>Ticker symbol reservation</td>
                  <td style={{ paddingLeft: '50px' }}>2,500 POLY</td>
                </tr>
                <tr>
                  <td style={{ paddingTop: '20px' }}>
                    Security token configuration
                  </td>
                  <td style={{ paddingLeft: '50px' }}>10,000 POLY</td>
                </tr>
                <tr>
                  <td style={{ paddingTop: '20px' }}>
                    Manual distribution of security tokens
                  </td>
                  <td style={{ paddingLeft: '50px' }}>No usage fee</td>
                </tr>
                <tr>
                  <td style={{ paddingTop: '20px' }}>
                    Automated distribution of security tokens via Simple STO
                  </td>
                  <td style={{ paddingLeft: '50px' }}>50,000 POLY</td>
                </tr>
                <tr>
                  <td style={{ paddingTop: '20px' }}>
                    Automated distribution of security tokens via USD Tiered STO
                  </td>
                  <td style={{ paddingLeft: '50px' }}>150,000 POLY</td>
                </tr>
              </table>
            </AccordionItem>
          </Accordion>
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
