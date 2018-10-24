// @flow

import React from 'react';
import styled from 'styled-components';

import DynamicTable from '../DynamicTable';

import './style.scss';

const Table = ({ children, ...props }) => {
  return (
    <DynamicTable className="pui-data-table--simple" {...props}>
      {children}
    </DynamicTable>
  );
};

export default Table;
