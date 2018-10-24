// @flow
import React from 'react';
import { DataTable } from 'carbon-components-react';

import Component from './SimpleTable';

const SimpleTable = Object.assign(Component, DataTable);

SimpleTable.Table = ({ children, ...props }) => (
  <DataTable.Table zebra={false} {...props}>
    {children}
  </DataTable.Table>
);

export default SimpleTable;
