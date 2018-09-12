/* eslint-disable max-len, react/no-danger */
import React from 'react';

import styles from './styles';

export default ({ pin }: { pin: string }) => (
  <html lang="en">
    <head>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </head>
    <body>
      <div className="wrapper">
        <div className="top-bar">
          {/* FIXME @RafaelVidaurre: Remove hardcoded URL */}
          <img
            alt="Polymath Logo"
            src="https://polymath-offchain.herokuapp.com/img/logo.png"
          />
        </div>
        <div className="content">
          <h1>Thank You for Signing Up to Polymath!</h1>
          <h2>
            To complete your sign up, please verify your email by entering the
            following PIN into your Polymath dashboard. If the correct PIN is
            entered, you will be able to proceed.
          </h2>
          <div className="main-value">
            <h2>Your Polymath Verification PIN</h2>
            <p className="value">{pin}</p>
          </div>
          <div className="icon-text" style={{ height: '52px' }}>
            <div className="icon question">
              <img
                alt="Icon"
                src="https://polymath-offchain.herokuapp.com/img/question.png"
              />
            </div>
            <h2>
              If you have any questions, please reach out to
              <br />
              <a href="mailto:tokenstudio@polymath.zendesk.com">
                tokenstudio@polymath.zendesk.com
              </a>
            </h2>
          </div>
          <h2 className="sincere">
            Best,
            <br />
            Polymath Support
          </h2>
        </div>
        <div className="footer">
          <div className="left">© 2018 Polymath</div>
          <div className="right">
            <a href="https://polymath.network/termsofservice.html">
              Terms of use
            </a>
            <a href="https://polymath.network/privacypolicy.html">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </body>
  </html>
);
