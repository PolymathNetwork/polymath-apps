// @flow

import React from 'react';
import { DataTable } from 'carbon-components-react';

import './style.scss';

const DynamicTable = ({ children, className, ...props }) => {
  return (
    <div className={'pui-data-table' + (className ? ` ${className}` : '')}>
      <DataTable {...props}>{children}</DataTable>
    </div>
  );
};

export default DynamicTable;
