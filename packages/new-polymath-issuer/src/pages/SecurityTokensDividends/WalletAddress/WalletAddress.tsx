import React, { FC, Fragment } from 'react';
import { formatters } from '@polymathnetwork/new-shared';
import { Paragraph, Label } from '@polymathnetwork/new-ui';

interface Props {
  walletAddress: string;
  defaultWalletAddress: string;
}

export const WalletAddress: FC<Props> = ({
  walletAddress,
  defaultWalletAddress,
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
        {walletAddress === defaultWalletAddress && (
          <Label color="baseText" bg="gray.1">
            Current Wallet Address
          </Label>
        )}
      </Paragraph>
    </Fragment>
  );
};
