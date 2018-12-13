import React, { Component, ReactChildren, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Redirect } from '@reach/router';
import { RootState } from '~/state/store';
import { Wallet } from '~/types';
import { RequireEthereumSupport } from './RequireEthereumSupport';

interface Props {
  render: () => ReactNode;
  redirectTo: string;
  wallet?: Wallet;
}

export class RequireWalletBase extends Component<Props> {
  public static defaultProps = {
    redirectTo: '/login',
  };

  public render() {
    const { children, redirectTo, wallet } = this.props;

    return (
      <RequireEthereumSupport
        render={() => {
          if (wallet) {
            return children;
          }

          return <Redirect to={redirectTo} noThrow />;
        }}
      />
    );
  }
}

const mapDispatchToProps = ({ session }: RootState) => ({
  wallet: session.wallet,
});

export const RequireWallet = connect(mapDispatchToProps)(RequireWalletBase);
