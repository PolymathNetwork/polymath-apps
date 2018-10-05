// @flow

// TODO @monitz87: check and refactor if needed

import React from 'react';

import { EmailWrapper } from './EmailWrapper';

type Props = {|
  pin: string,
|};

export const AccountConfirmation = ({ pin }: Props) => (
  <EmailWrapper>
    <h1>Thank You for Signing Up to Polymath!</h1>
    <h2>
      To complete your sign up, please verify your email by entering the
      following PIN into your Polymath dashboard. If the correct PIN is entered,
      you will be able to proceed.
    </h2>
    <div className="main-value">
      <h2>Your Polymath Verification PIN</h2>
      <p className="value">{pin}</p>
    </div>
  </EmailWrapper>
);
