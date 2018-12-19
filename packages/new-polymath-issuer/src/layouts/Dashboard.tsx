import React, { FC } from 'react';

export const DashboardLayout: FC = ({ children }) => (
  <div>
    <h1>Some dashboard layout</h1>
    <div>{children}</div>
  </div>
);
