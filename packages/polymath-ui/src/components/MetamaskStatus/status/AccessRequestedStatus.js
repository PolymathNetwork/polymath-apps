// @flow

import React from 'react';

import Heading from '../../Heading';
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
    <Heading as="h1" variant="h1">
      To Proceed, Connect the Token Studio with Metamask
    </Heading>
    <Heading as="h3" variant="h4">
      The Polymath Token Studio uses the Metamask plugin to associate your
      profile and security token with your wallet. This association allows your
      wallet to be the key to controlling your security token. To use the
      Polymath Token Studio, simply open the metamask extension in your browser
      and follow the instructions.
    </Heading>
    <p>
      <Button onClick={onRequestAuth}>Connect to Metamask</Button>
    </p>
  </div>
);

export default AccessRequestedStatus;
