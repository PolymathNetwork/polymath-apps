// @flow

import React, { Component } from 'react';
import {
  Table,
  Box,
  ButtonSmall,
  IconButton,
  icons,
  InlineFlex,
  Icon,
  Button,
  Label,
  TooltipPrimary,
} from '@polymathnetwork/new-ui';


const columns = [
  {
    Header: 'Whitelist Manager Wallet Address',
    accessor: 'Address',
    width: 250,
    Cell: ({ value }) => value
  },
  {
    Header: 'Manager Details',
    accessor: 'Details',
    width: 250,
    Cell: ({ value }) => value
  }
];
class WhitelistTable extends Component<Props> {
  render() {
    return (
      <Table
        columns={columns}
        data={[{ Address: 'dtat', Details: 'Some deets' }]}
      >
        <Table.Rows />
      </Table>
    )
  }
}

export default WhitelistTable;