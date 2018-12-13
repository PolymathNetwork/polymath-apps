import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';
import { RequireWallet } from '~/components/composers/RequireWallet';

export const DashboardLayout: FC<RouteComponentProps> = ({ children }) => (
  <RequireWallet
    render={() => (
      <div>
        <h1>Some dashboard layout</h1>
        <div>{children}</div>
      </div>
    )}
  />
);
