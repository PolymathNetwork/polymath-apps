// @flow
import React from 'react';
import { DataTable } from 'carbon-components-react';

import Component from './Table';

const Table = Object.assign(Component, DataTable);

Table.Table = ({ children, ...props }) => (
  <DataTable.Table zebra={false} {...props}>
    {children}
  </DataTable.Table>
);

export default Table;
