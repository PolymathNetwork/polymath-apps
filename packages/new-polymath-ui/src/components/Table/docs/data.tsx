import React from 'react';
import { Column } from 'react-table';
import { SvgDelete } from '~/images/icons/Delete';
import { SvgPen } from '~/images/icons/Pen';
import { IconButton } from '~/components/IconButton';
import { RowActions } from '../RowActions';
import { makeData } from './makeData';

export const data = makeData(1000);

export const columns: Column[] = [
  {
    Header: 'First Name',
    accessor: 'firstName',
    minWidth: 140,
    maxWidth: 200,
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
  },
  {
    Header: 'Visits',
    accessor: 'visits',
    width: 100,
  },
  {
    Header: 'Status',
    accessor: 'status',
    width: 120,
    Cell: (row: any) => (
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
  {
    accessor: 'actions',
    width: 80,
    Cell: () => (
      <RowActions>
        <IconButton
          Asset={SvgPen}
          width="1.5rem"
          height="1.5rem"
          color="gray.2"
        />
        <IconButton
          Asset={SvgDelete}
          width="1.5rem"
          height="1.5rem"
          color="gray.2"
        />
      </RowActions>
    ),
  },
];
