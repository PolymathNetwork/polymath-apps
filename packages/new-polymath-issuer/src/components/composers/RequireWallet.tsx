import React, { Component, ReactChildren, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Redirect } from '@reach/router';
import { RootState } from '~/state/store';
import { Wallet } from '~/types';
import { RequireEthereumSupport } from './RequireEthereumSupport';

interface Props {
  render?: () => ReactNode;
  children?: ReactNode;
  redirectTo: string;
  wallet?: Wallet;
}

export class RequireWalletBase extends Component<Props> {
  public static defaultProps = {
    redirectTo: '/login',
  };

  public renderChildren() {
    const { children, render } = this.props;
    return render || children || null;
  }

  public render() {
    const { redirectTo, wallet } = this.props;

    return (
      <RequireEthereumSupport>
        {wallet ? this.renderChildren() : <Redirect to={redirectTo} noThrow />}
      </RequireEthereumSupport>
    );
  }
}

const mapDispatchToProps = ({ session }: RootState) => ({
  wallet: session.wallet,
});

export const RequireWallet = connect(mapDispatchToProps)(RequireWalletBase);
