import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Loading } from '~/components/__temporary';
import { RootState } from '~/state/store';

interface Props {
  render?: () => ReactNode;
  children?: ReactNode;
  polyClientInitialized: boolean;
}

class RequireAppConnectedBase extends Component<Props> {
  public render() {
    const { polyClientInitialized, render, children } = this.props;

    if (!polyClientInitialized) {
      return <Loading />;
    }

    return render || children || null;
  }
}

const mapStateToProps = ({ app }: RootState) => ({
  polyClientInitialized: app.polyClientInitialized,
});

export const RequireAppConnected = connect(mapStateToProps)(
  RequireAppConnectedBase
);
