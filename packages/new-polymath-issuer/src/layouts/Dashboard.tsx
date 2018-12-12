import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';

export const DashboardLayout: FC<RouteComponentProps> = ({ children }) => (
  <div>{children}</div>
);
