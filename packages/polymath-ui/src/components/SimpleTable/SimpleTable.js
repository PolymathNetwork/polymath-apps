// @flow

import React from 'react';
import styled, { css } from 'styled-components';

import DynamicTable from '../DynamicTable';

const SimpleTable = ({ ...props }) => {
  return <DynamicTable {...props} />;
};

SimpleTable.Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes[0]};

  thead {
    background-color: ${({ theme }) => theme.colors.gray[0]};
  }

  th,
  td {
    vertical-align: middle;
    padding-left: ${({ theme }) => theme.space[3]};
  }

  th {
    color: ${({ theme }) => theme.colors.baseText};
  }

  tr {
    height: 2rem;
  }
`;

SimpleTable.TableRow = styled(DynamicTable.TableRow)`
  border: 1px solid transparent;
  border-bottom: none;
  color: ${({ theme }) => theme.colors.gray[1]};
  ${({ isActive, theme }) =>
    isActive &&
    css`
      border: 1px solid ${theme.colors.gray[1]};
      color: ${theme.colors.baseText};
    `};
`;
SimpleTable.TableHead = DynamicTable.TableHead;
SimpleTable.TableBody = DynamicTable.TableBody;
SimpleTable.TableHeader = DynamicTable.TableHeader;
SimpleTable.TableCell = DynamicTable.TableCell;

export default SimpleTable;
