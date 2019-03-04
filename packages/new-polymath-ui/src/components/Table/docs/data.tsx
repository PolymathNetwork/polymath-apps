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
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
        />
        <IconButton
          Asset={SvgDelete}
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
        />
      </RowActions>
    ),
  },
];

export const dataTests = [
  {
    firstName: 'fishing',
    lastName: 'historian',
    age: 20,
    visits: 60,
    progress: 32,
    status: 'single',
  },
  {
    firstName: 'physics',
    lastName: 'quality',
    age: 11,
    visits: 90,
    progress: 33,
    status: 'complicated',
  },
  {
    firstName: 'burn',
    lastName: 'ship',
    age: 10,
    visits: 52,
    progress: 82,
    status: 'complicated',
  },
  {
    firstName: 'wine',
    lastName: 'reading',
    age: 18,
    visits: 34,
    progress: 1,
    status: 'complicated',
  },
  {
    firstName: 'hospital',
    lastName: 'low',
    age: 23,
    visits: 93,
    progress: 56,
    status: 'single',
  },
  {
    firstName: 'reaction',
    lastName: 'category',
    age: 17,
    visits: 56,
    progress: 6,
    status: 'relationship',
  },
  {
    firstName: 'letter',
    lastName: 'produce',
    age: 6,
    visits: 12,
    progress: 39,
    status: 'relationship',
  },
  {
    firstName: 'skirt',
    lastName: 'impulse',
    age: 16,
    visits: 52,
    progress: 60,
    status: 'relationship',
  },
  {
    firstName: 'police',
    lastName: 'desire',
    age: 5,
    visits: 13,
    progress: 42,
    status: 'single',
  },
  {
    firstName: 'delivery',
    lastName: 'art',
    age: 21,
    visits: 63,
    progress: 86,
    status: 'single',
  },
  {
    firstName: 'arm',
    lastName: 'farmer',
    age: 11,
    visits: 3,
    progress: 84,
    status: 'relationship',
  },
  {
    firstName: 'analyst',
    lastName: 'income',
    age: 3,
    visits: 3,
    progress: 16,
    status: 'single',
  },
  {
    firstName: 'form',
    lastName: 'zipper',
    age: 23,
    visits: 1,
    progress: 35,
    status: 'single',
  },
  {
    firstName: 'corn',
    lastName: 'person',
    age: 28,
    visits: 76,
    progress: 2,
    status: 'single',
  },
  {
    firstName: 'satisfaction',
    lastName: 'courage',
    age: 24,
    visits: 69,
    progress: 91,
    status: 'complicated',
  },
  {
    firstName: 'hose',
    lastName: 'square',
    age: 16,
    visits: 92,
    progress: 78,
    status: 'single',
  },
  {
    firstName: 'math',
    lastName: 'establishment',
    age: 2,
    visits: 61,
    progress: 63,
    status: 'complicated',
  },
  {
    firstName: 'arm',
    lastName: 'bite',
    age: 18,
    visits: 47,
    progress: 0,
    status: 'relationship',
  },
  {
    firstName: 'society',
    lastName: 'waste',
    age: 1,
    visits: 87,
    progress: 98,
    status: 'complicated',
  },
  {
    firstName: 'enthusiasm',
    lastName: 'chin',
    age: 6,
    visits: 1,
    progress: 79,
    status: 'relationship',
  },
  {
    firstName: 'dress',
    lastName: 'media',
    age: 20,
    visits: 88,
    progress: 7,
    status: 'single',
  },
  {
    firstName: 'union',
    lastName: 'produce',
    age: 23,
    visits: 12,
    progress: 72,
    status: 'single',
  },
  {
    firstName: 'strategy',
    lastName: 'magic',
    age: 0,
    visits: 31,
    progress: 89,
    status: 'relationship',
  },
  {
    firstName: 'corn',
    lastName: 'station',
    age: 2,
    visits: 71,
    progress: 11,
    status: 'single',
  },
  {
    firstName: 'offer',
    lastName: 'pen',
    age: 23,
    visits: 27,
    progress: 1,
    status: 'relationship',
  },
  {
    firstName: 'sound',
    lastName: 'top',
    age: 28,
    visits: 32,
    progress: 84,
    status: 'single',
  },
  {
    firstName: 'ground',
    lastName: 'view',
    age: 1,
    visits: 67,
    progress: 97,
    status: 'relationship',
  },
  {
    firstName: 'driving',
    lastName: 'wax',
    age: 12,
    visits: 64,
    progress: 81,
    status: 'single',
  },
  {
    firstName: 'construction',
    lastName: 'bone',
    age: 14,
    visits: 21,
    progress: 46,
    status: 'complicated',
  },
  {
    firstName: 'fog',
    lastName: 'design',
    age: 27,
    visits: 77,
    progress: 11,
    status: 'single',
  },
  {
    firstName: 'reception',
    lastName: 'pets',
    age: 2,
    visits: 6,
    progress: 29,
    status: 'single',
  },
  {
    firstName: 'singer',
    lastName: 'low',
    age: 12,
    visits: 37,
    progress: 93,
    status: 'relationship',
  },
  {
    firstName: 'tooth',
    lastName: 'gene',
    age: 25,
    visits: 97,
    progress: 60,
    status: 'complicated',
  },
  {
    firstName: 'customer',
    lastName: 'cream',
    age: 25,
    visits: 70,
    progress: 62,
    status: 'relationship',
  },
  {
    firstName: 'process',
    lastName: 'division',
    age: 2,
    visits: 26,
    progress: 14,
    status: 'relationship',
  },
  {
    firstName: 'look',
    lastName: 'reading',
    age: 1,
    visits: 0,
    progress: 53,
    status: 'complicated',
  },
  {
    firstName: 'nature',
    lastName: 'brush',
    age: 25,
    visits: 48,
    progress: 43,
    status: 'single',
  },
  {
    firstName: 'mitten',
    lastName: 'pizzas',
    age: 28,
    visits: 77,
    progress: 66,
    status: 'complicated',
  },
  {
    firstName: 'legs',
    lastName: 'design',
    age: 2,
    visits: 38,
    progress: 34,
    status: 'relationship',
  },
  {
    firstName: 'disease',
    lastName: 'knee',
    age: 24,
    visits: 38,
    progress: 12,
    status: 'complicated',
  },
  {
    firstName: 'midnight',
    lastName: 'mom',
    age: 28,
    visits: 87,
    progress: 39,
    status: 'complicated',
  },
  {
    firstName: 'shirt',
    lastName: 'spark',
    age: 5,
    visits: 98,
    progress: 89,
    status: 'single',
  },
  {
    firstName: 'lip',
    lastName: 'spiders',
    age: 19,
    visits: 54,
    progress: 99,
    status: 'single',
  },
  {
    firstName: 'toothbrush',
    lastName: 'power',
    age: 2,
    visits: 33,
    progress: 12,
    status: 'relationship',
  },
  {
    firstName: 'policy',
    lastName: 'finger',
    age: 4,
    visits: 51,
    progress: 10,
    status: 'single',
  },
  {
    firstName: 'mood',
    lastName: 'field',
    age: 19,
    visits: 28,
    progress: 21,
    status: 'relationship',
  },
  {
    firstName: 'fireman',
    lastName: 'achieve',
    age: 26,
    visits: 33,
    progress: 9,
    status: 'complicated',
  },
  {
    firstName: 'ground',
    lastName: 'penalty',
    age: 16,
    visits: 58,
    progress: 19,
    status: 'complicated',
  },
  {
    firstName: 'blow',
    lastName: 'climate',
    age: 23,
    visits: 93,
    progress: 15,
    status: 'relationship',
  },
  {
    firstName: 'church',
    lastName: 'kiss',
    age: 16,
    visits: 17,
    progress: 97,
    status: 'relationship',
  },
];
