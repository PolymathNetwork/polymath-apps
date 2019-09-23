// @flow

import React, { Component } from 'react';
import { DataTable, Icon } from 'carbon-components-react';
import { Button } from '@polymathnetwork/ui';
import IndividualRestrictionsModal from './IndividualRestrictionsModal';
import ImportRestrictionsModal from './ImportRestrictionsModal';
import { connect } from 'react-redux';
import { modifyIndividualRestriction } from '../../../actions/restrictions';
import { dispatch } from 'rxjs/internal/observable/range';
import moment from 'moment';
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
    header: 'Investor Wallet Address',
    key: 'address',
    Cell: ({ value }) => value,
  },
  {
    header: 'Maximum 24h Transfer (# or %)',
    key: 'dailyRestrictionType',
    Cell: ({ value }) => value,
  },
  {
    header: 'Start Date',
    key: 'dailyStartTime',
    cell: ({ value }) => value,
  },
  {
    header: 'End Date',
    key: 'dailyEndTime',
    Cell: ({ value }) => value,
  },
  {
    header: 'Custom Rolling Period Interval',
    key: 'rollingPeriodInDays',
    Cell: ({ value }) => value,
  },
  {
    header: 'Maximum Custom Transfer (# or %)',
    key: 'customRestrictionType',
    Cell: ({ value }) => value,
  },
  {
    header: 'Start Date',
    key: 'customStartTime',
    Cell: ({ value }) => value,
  },
  {
    header: 'End Date',
    key: 'customEndTime',
    Cell: ({ value }) => value,
  },
];

type State = {|
  isIndividualRestrictionModalOpen: boolean,
  isUploadCsvModal: boolean,
|};

class IndividualRestrictionsTable extends Component<Props, State> {
  state = {
    isIndividualRestrictionModalOpen: false,
    isUploadCsvModal: false,
  };

  editAddress = address => {
    const { individualRestrictions } = this.props;
    let restriction = individualRestrictions.find(i => i.address === address);
    this.props.modifyIndividualRestriction(restriction);
    this.setState({ isIndividualRestrictionModalOpen: true });
  };

  handleCsvOpen = () => {
    this.setState({ isUploadCsvModal: true });
  };

  handleCsvClose = () => {
    this.setState({ isUploadCsvModal: false });
  };

  handleOpen = () => {
    this.setState({ isIndividualRestrictionModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isIndividualRestrictionModalOpen: false });
    this.props.modifyIndividualRestriction(null);
  };

  handleDelete = id => {
    this.props.removeAddressFromTransferManager(id);
  };

  formatCell = (id, cell) => {
    const { individualRestrictions } = this.props;
    if (cell.value === undefined) return '-';
    switch (cell.info.header) {
      case 'customStartTime':
      case 'dailyStartTime':
      case 'customEndTime':
      case 'dailyEndTime':
        return moment.unix(cell.value / 1000).format('MMM DD YYYY');
      case 'customRestrictionType':
        let restriction = individualRestrictions.find(i => i.address === id);
        return `${
          cell.value == 1
            ? restriction.customAllowedTokens * 100
            : restriction.customAllowedTokens
        } ${cell.value == 1 ? '%' : 'TOKENS'}`;
      case 'dailyRestrictionType':
        let x = individualRestrictions.find(i => i.address === id);
        return `${
          cell.value == 1 ? x.dailyAllowedTokens * 100 : x.dailyAllowedTokens
        } ${cell.value == 1 ? '%' : 'TOKENS'}`;
      case 'rollingPeriodInDays':
        return `${cell.value} days`;
      default:
        return cell.value;
    }
  };

  render() {
    const { individualRestrictions } = this.props;
    return (
      <div>
        <IndividualRestrictionsModal
          isOpen={this.state.isIndividualRestrictionModalOpen}
          handleClose={this.handleClose}
        />
        <ImportRestrictionsModal
          isOpen={this.state.isUploadCsvModal}
          onClose={this.handleCsvClose}
        />
        <DataTable
          headers={columns}
          rows={
            individualRestrictions < 1
              ? [{ id: '0', address: '-', details: '-' }]
              : individualRestrictions
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
                    <Button
                      style={{ marginLeft: '5px' }}
                      onClick={this.handleCsvOpen}
                      icon="upload"
                    >
                      Upload CSV
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow
                        key={row.id}
                        onClick={() => this.editAddress(row.id)}
                      >
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>
                            {this.formatCell(row.id, cell)}
                          </TableCell>
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
  individualRestrictions: state.restrictions.individualRestrictions,
});

const mapDispatchToProps = {
  modifyIndividualRestriction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndividualRestrictionsTable);
