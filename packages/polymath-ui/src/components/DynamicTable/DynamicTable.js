// @flow

import React from 'react';
import { DataTable } from 'carbon-components-react';

import './style.scss';

const DynamicTable = ({ children, ...props }) => {
  return (
    <div className="pui-data-table">
      <DataTable {...props}>{children}</DataTable>
    </div>
  );
};

export default DynamicTable;
