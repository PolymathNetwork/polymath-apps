import React, { FC } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Header } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';

type HeaderProps = typeHelpers.GetProps<typeof Header>;

export interface Props
  extends Pick<HeaderProps, 'variant' | 'walletAddress' | 'RouterLink'> {}

const mapStateToProps = (state: RootState) => ({
  walletAddress: get(state, 'session.wallet.address'),
});

const ContainerBase: FC<Props> & { defaultProps: { variant: 'default' } } = ({
  walletAddress,
  ...otherProps
}) => {
  return (
    <Header
      walletAddress={walletAddress}
      symbol="TORO"
      network=""
      {...otherProps}
    />
  );
};

ContainerBase.defaultProps = {
  variant: 'default',
};

export const Container = connect(mapStateToProps)(ContainerBase);
