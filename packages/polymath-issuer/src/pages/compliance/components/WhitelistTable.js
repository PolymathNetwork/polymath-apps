// @flow

import React, { Component } from 'react';
import { DataTable } from 'carbon-components-react';
import { Button } from '@polymathnetwork/ui';
import WhitelistModal from './WhitelistModal';
import { connect } from 'react-redux';
import { addManager } from '../../../actions/compliance';
const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbar,
  TableToolbarContent,
} = DataTable;

const columns = [
  {
    header: 'Whitelist Manager Wallet Address',
    key: 'address',
    width: 250,
    Cell: ({ value }) => value,
  },
  {
    header: 'Manager Details',
    key: 'details',
    width: 250,
    Cell: ({ value }) => value,
  },
];

type State = {|
  isWhitelistModalOpen: boolean,
|};

class WhitelistTable extends Component<Props, State> {
  state = {
    isWhitelistModalOpen: false,
  };

  handleOpen = () => {
    this.setState({ isWhitelistModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isWhitelistModalOpen: false });
  };

  render() {
    const { approvedManagers } = this.props;
    return (
      <div>
        <WhitelistModal
          isOpen={this.state.isWhitelistModalOpen}
          handleClose={this.handleClose}
        />
        <DataTable
          headers={columns}
          rows={
            approvedManagers < 1
              ? [{ id: '0', address: '-', details: '-' }]
              : approvedManagers
          }
          render={({ rows, headers, getHeaderProps }) => {
            return (
              <TableContainer title="">
                <TableToolbar>
                  <TableToolbarContent>
                    {/* pass in `onInputChange` change here to make filtering work */}
                    <Button onClick={this.handleOpen} icon="icon--add">
                      Add new
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow
                        key={row.address}
                        onMouseOver={() => console.log('test')}
                      >
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  approvedManagers: state.whitelist.approvedManagers,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps)(WhitelistTable);
