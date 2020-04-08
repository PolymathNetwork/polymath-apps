// @flow

import React, { Component } from 'react';
import { DataTable, Icon } from 'carbon-components-react';
import { Button } from '@polymathnetwork/ui';
import PartialTransferModal from './PartialTransferModal';
import { connect } from 'react-redux';
import { removeAddressFromPartialExempt } from '../../../actions/compliance';
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
    header: 'Wallet Address',
    key: 'address',
    width: 250,
    Cell: ({ value }) => value,
  },
];

type State = {|
  isPartialTransferModalOpen: boolean,
|};

export class PartialTransferTable extends Component<Props, State> {
  state = {
    isPartialTransferModalOpen: false,
  };

  handleOpen = () => {
    this.setState({ isPartialTransferModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isPartialTransferModalOpen: false });
  };

  handleDelete = id => {
    this.props.removeAddressFromPartialExempt(id);
  };

  render() {
    const { partialAddresses } = this.props;
    return (
      <div>
        <PartialTransferModal
          isOpen={this.state.isPartialTransferModalOpen}
          handleClose={this.handleClose}
        />
        <DataTable
          headers={columns}
          rows={
            partialAddresses.length < 1
              ? [{ id: '0', address: '-' }]
              : partialAddresses
          }
          render={({ rows, headers, getHeaderProps }) => {
            return (
              <TableContainer title="">
                <TableToolbar>
                  <TableToolbarContent>
                    {/* pass in `onInputChange` change here to make filtering work */}
                    <Button onClick={this.handleOpen} icon="icon--add">
                      Exempt a Wallet
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader
                          key={header}
                          {...getHeaderProps({ header })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        {partialAddresses.length > 0 ? (
                          <TableCell
                            className="delete-icon"
                            onClick={() => this.handleDelete(row.id)}
                          >
                            <Icon name="delete" width="12" height="12" />
                          </TableCell>
                        ) : (
                          <TableCell />
                        )}
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
  partialAddresses: state.whitelist.partialAddresses,
});

const mapDispatchToProps = {
  removeAddressFromPartialExempt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartialTransferTable);
