import React, { FC, Fragment } from 'react';
import { formatters } from '@polymathnetwork/new-shared';
import { Paragraph, Label } from '@polymathnetwork/new-ui';

interface Props {
  walletAddress: string;
  userWalletAddress: string;
}

export const WalletAddress: FC<Props> = ({
  walletAddress,
  userWalletAddress,
}) => {
  return (
    <Fragment>
      <Paragraph bold color="highlightText" mb={1}>
        Wallet Address to Receive Tax Withholdings
      </Paragraph>
      <Paragraph>
        {formatters.toShortAddress(walletAddress, {
          size: 26,
        })}
        <br />
        {walletAddress === userWalletAddress ? (
          <Label color="baseText" bg="gray.1">
            Current Wallet Address
          </Label>
        ) : (
          <Label color="#9e36c7">Custom Wallet Address</Label>
        )}
      </Paragraph>
    </Fragment>
  );
};
