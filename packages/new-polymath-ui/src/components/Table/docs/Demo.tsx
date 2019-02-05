import React, { useState } from 'react';
import { makeData } from './makeData';

import { Input } from '../Styles';
import { Table } from '../Table';

export const Demo = () => {
  const [data] = useState(() => makeData(1000));
  const [columns] = useState([
    {
      Header: 'First Name',
      accessor: 'firstName',
      minWidth: 140,
      maxWidth: 200,
      Filter: header => {
        return (
          <Input
            placeholder='Search...  eg. "room"...'
            value={header.filterValue || ''}
            onChange={e => header.setFilter(e.target.value)}
          />
        );
      },
    },
    {
      Header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
      minWidth: 140,
      maxWidth: 200,
    },
    {
      Header: 'Age',
      accessor: 'age',
      width: 100,
      aggregate: 'average',
    },
    {
      Header: 'Visits',
      accessor: 'visits',
      width: 100,
      aggregate: 'sum',
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: 150,
      Cell: row => (
        <span>
          <span
            style={{
              color:
                row.value === 'relationship'
                  ? '#ff2e00'
                  : row.value === 'complicated'
                  ? '#ffbf00'
                  : '#57d500',
              transition: 'all .5s ease',
            }}
          >
            &#x25cf;
          </span>{' '}
          {row.value === 'relationship'
            ? 'Relationship'
            : row.value === 'complicated'
            ? `Complicated`
            : 'Single'}
        </span>
      ),
    },
  ]);

  return (
    <Table
      {...{
        data,
        columns,
        debug: true,
      }}
    />
  );
};
