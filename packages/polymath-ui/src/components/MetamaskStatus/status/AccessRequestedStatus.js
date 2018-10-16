// @flow

import React from 'react';

import metamask from '../../../images/metamask.png';

const AccessRequested = () => (
  <div id="metamask-access-requested" className="pui-single-box-header">
    <div className="pui-single-box-metamask">
      <img src={metamask} alt="Metamask" />
    </div>
    <h1 className="pui-h1">
      To Proceed, Connect the Token Studio with Metamask
    </h1>
    <h3 className="pui-h3">
      The Polymath Token Studio uses the Metamask plugin to associate your
      profile and security token with your wallet. This association allows your
      wallet to be the key to controlling your security token. To use the
      Polymath Token Studio, simply open the metamask extension in your browser
      and follow the instructions.
    </h3>
  </div>
);

export default AccessRequested;
