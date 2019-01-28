import React, { FC } from 'react';
import { connect } from 'react-redux';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Header } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';
import { sessionSelector } from '~/state/selectors';

type HeaderProps = typeHelpers.GetProps<typeof Header>;

export interface Props
  extends Pick<HeaderProps, 'variant' | 'walletAddress' | 'RouterLink'> {}

const mapStateToProps = (state: RootState) => {
  const { wallet } = sessionSelector(state);
  let walletAddress;

  if (wallet) {
    walletAddress = wallet.address;
  }

  return { walletAddress };
};

const ContainerBase: FC<Props> & { defaultProps: { variant: 'default' } } = ({
  walletAddress,
  ...otherProps
}) => {
  return (
    <Header
      walletAddress={walletAddress}
      // TODO @monitz87: replace this with actual token symbol
      symbol="TORO"
      // TODO @monitz87: replace with actual network
      network=""
      {...otherProps}
    />
  );
};

ContainerBase.defaultProps = {
  variant: 'default',
};

export const Container = connect(mapStateToProps)(ContainerBase);
