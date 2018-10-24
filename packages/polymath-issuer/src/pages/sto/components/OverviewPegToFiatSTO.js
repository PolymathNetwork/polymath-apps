// @flow

import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { STOStatus, Table, NotFoundPage } from '@polymathnetwork/ui';
import { Button } from 'carbon-components-react';
import type {
  SecurityToken,
  STOPurchase,
  STODetails,
} from '@polymathnetwork/js/types';

import { togglePauseSto, exportInvestorsList } from '../../../actions/sto';
import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>,
  isStoPaused: boolean,
|};

type DispatchProps = {|
  togglePauseSto: (endDate: Date) => any,
  exportInvestorsList: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
  isStoPaused: state.sto.pauseStatus,
});

const mapDispatchToProps: DispatchProps = {
  togglePauseSto,
  exportInvestorsList,
};

type Props = {||} & StateProps & DispatchProps;

const { TableHead, TableHeader, TableBody, TableRow, TableData } = Table;

class OverviewPegToFiatSTO extends Component<Props> {
  handlePause = () => {
    // $FlowFixMe
    this.props.togglePauseSto();
  };

  handleExport = () => {
    this.props.exportInvestorsList();
  };

  render() {
    const { token, details } = this.props;

    const {
      TableContainer,
      Table,
      TableHead,
      TableHeader,
      TableBody,
      TableRow,
      TableCell,
    } = Table;

    const headers = [
      {
        // `key` is the name of the field on the row object itself for the header
        key: 'tier',
        // `header` will be the name you want rendered in the Table Header
        header: '# Tier',
      },
      {
        key: 'tokenPrice',
        header: 'Token Price',
      },
      {
        key: 'raiseTarget',
        header: 'Total Raise Target',
      },
      {
        key: 'raised',
        header: 'Raised',
      },
      {
        key: 'progress',
        header: '',
      },
    ];

    const rows = [
      {
        id: 'a',
        tier: 1,
        tokenPrice: 100,
        raiseTarget: 300000,
        raised: 100,
        progress: (
          <InlineFlex>
            <Box width="150px" mr={1}>
              <ProgressBar progress={0.5} />
            </Box>
            100%
          </InlineFlex>
        ),
      },
    ];

    if (!token || !details) {
      return <NotFoundPage />;
    }
    return (
      <DocumentTitle title={`${token.ticker} STO Overview – Polymath`}>
        <div>
          <Fragment>
            <h1 className="pui-h1">Security Token Overview</h1>
            <br />
            <STOStatus // eslint-disable-next-line react/jsx-handler-names
              toggleStoPause={this.handlePause}
              details={details}
              token={token}
              isStoPaused={this.props.isStoPaused}
            />
            <Table
              rows={rows}
              headers={headers}
              render={({ rows, headers }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headers.map(header => (
                          <TableHeader>{header.header}</TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow key={row.id}>
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />
            <Button
              icon="download"
              kind="secondary"
              onClick={this.handleExport}
              style={{
                float: 'left',
                marginTop: '-89px',
                marginLeft: '25px',
              }}
            >
              Export List Of Investors
            </Button>
          </Fragment>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewPegToFiatSTO);
