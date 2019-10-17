// @flow

import React, { Component } from 'react';
import { DataTable, Icon } from 'carbon-components-react';
import { Button } from '@polymathnetwork/ui';
import ApprovalModal from './ApprovalModal';
import { connect } from 'react-redux';
import { removeAddressFromTransferManager } from '../../../actions/compliance';
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
    header: 'From Investor Wallet Address',
    key: 'fromAddress',
  },
  {
    header: 'To Investor Wallet Address',
    key: 'toAddress',
  },
  {
    header: 'Approval Expiry',
    key: 'expiry',
  },
  {
    header: 'Unique ID (TxHash) of Approval',
    key: 'txhash',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Approved Token Transfer',
    key: 'tokens',
  },
  {
    header: 'Tokens Transferred to Date',
    key: 'tokensTransferred',
  },
];

const emptyRow = [
  {
    id: '0',
    fromAddress: '-',
    toAddress: '-',
    expiry: '-',
    txhash: '-',
    description: '-',
    tokens: '-',
    tokensTransferred: '-',
  },
];

type State = {|
  isApprovalModalOpen: boolean,
|};

class ApprovalTable extends Component<Props, State> {
  state = {
    isApprovalModalOpen: false,
  };

  handleOpen = () => {
    this.setState({ isApprovalModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isApprovalModalOpen: false });
  };

  handleDelete = id => {
    this.props.removeAddressFromTransferManager(id);
  };

  render() {
    const { approvedManagers } = this.props;
    return (
      <div>
        <ApprovalModal
          isOpen={this.state.isApprovalModalOpen}
          handleClose={this.handleClose}
        />
        <DataTable
          headers={columns}
          rows={approvedManagers < 1 ? emptyRow : approvedManagers}
          render={({ rows, headers, getHeaderProps }) => {
            return (
              <TableContainer title="">
                <TableToolbar>
                  <TableToolbarContent>
                    {/* pass in `onInputChange` change here to make filtering work */}
                    <Button onClick={this.handleOpen} icon="icon--add">
                      Add new exemption
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
                      <TableRow
                        key={row.id}
                        onMouseOver={() => console.log('test')}
                      >
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        {approvedManagers.length > 0 ? (
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
  approvedManagers: state.whitelist.approvedManagers,
});

const mapDispatchToProps = {
  removeAddressFromTransferManager,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApprovalTable);
