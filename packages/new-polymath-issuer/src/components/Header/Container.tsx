import React, { FC } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Header } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';

type HeaderProps = typeHelpers.GetProps<typeof Header>;

export interface Props extends HeaderProps {
  walletAddress: string;
}

const mapStateToProps = (state: RootState) => ({
  walletAddress: get(state, 'session.wallet.address'),
});

const ContainerBase: FC<Props> = ({ walletAddress, ...otherProps }) => {
  return <Header walletAddress={walletAddress} symbol="TORO" {...otherProps} />;
};

export const Container = connect(mapStateToProps)(ContainerBase);
