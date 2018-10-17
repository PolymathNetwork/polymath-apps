// @flow

import React from 'react';

import Button from '../../Button';

import illustrationImgSrc from '../../../images/link-to-metamask.svg';

type Props = {|
  onRequestAuth: Function,
|};

const AccessRequestedStatus = ({ onRequestAuth }: Props) => (
  <div id="metamask-access-requested">
    <img
      className="pui-metamask-status__header-img"
      src={illustrationImgSrc}
      alt="Polymath Studio to Metamask connection"
    />
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
    <p>
      <Button onClick={onRequestAuth}>Connect to Metamask</Button>
    </p>
  </div>
);

export default AccessRequestedStatus;
