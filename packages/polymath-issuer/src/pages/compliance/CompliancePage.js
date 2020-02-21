// @flow
/* eslint-disable react/jsx-no-bind, react/no-unused-state */ // TODO @bshevchenko

import {
  addressShortifier,
  confirm,
  etherscanAddress,
  NotFoundPage,
  Page,
  Grid,
  Remark,
  FormItem,
} from '@polymathnetwork/ui';
import { BigNumber } from 'bignumber.js';
import {
  Button,
  DataTable,
  // DatePicker,
  // DatePickerInput,
  Icon,
  InlineNotification,
  // PaginationV2,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  TextInput,
  Toggle,
  Tabs,
  Tab,
} from 'carbon-components-react';
import { Heading, CardFeatureState, icons } from '@polymathnetwork/new-ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import {
  addInvestor,
  disableOwnershipRestrictions,
  editInvestors,
  enableOwnershipRestrictions,
  exportWhitelist,
  fetchWhitelist,
  importWhitelist,
  listLength,
  PERMANENT_LOCKUP_TS,
  removeInvestors,
  resetUploaded,
  toggleFreeze,
  updateOwnershipPercentage,
  fetchManagers,
  toggleWhitelistManagement,
  addGeneralPermissionModule,
  archiveGeneralPermissionModule,
  addManualApprovalModule,
  archiveManualApprovalModule,
  fetchApprovals,
} from '../../actions/compliance';
import Progress from '../token/components/Progress';
import AddInvestorForm, {
  formName as addInvestorFormName,
} from './components/AddInvestorForm';
import { formName as editInvestorsFormName } from './components/EditInvestorsForm';
import ImportWhitelistModal from './components/ImportWhitelistModal';
import WhitelistTable from './components/WhitelistTable';
import ApprovalTable from './components/ApprovalTable';
import WhitelistModal from './components/WhitelistModal';
import './style.scss';
import type {
  Investor,
  Address,
  SecurityToken,
} from '@polymathnetwork/js/types';

import type { RootState } from '../../redux/reducer';
import type { InvestorCSVRow } from '../../actions/compliance';

const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableBatchActions,
  TableToolbarSearch,
  TableToolbarContent,
} = DataTable;

type StateProps = {|
  investors: Array<Investor>,
  criticals: Array<InvestorCSVRow>,
  stateListLength: number,
  token: SecurityToken,
  isPercentageEnabled: boolean,
  isPercentagePaused: boolean,
  percentage: ?number,
  isTokenFrozen: boolean,
|};

type DispatchProps = {|
  fetchWhitelist: () => any,
  listLength: number => any,
  addInvestor: () => any,
  importWhitelist: () => any,
  exportWhitelist: () => any,
  editInvestors: (investors: Array<Address>) => any,
  removeInvestors: (investors: Array<Address>) => any,
  reset: (formName: string) => any,
  resetUploaded: () => any,
  confirm: () => any,
  disableOwnershipRestrictions: () => any,
  enableOwnershipRestrictions: (percentage?: number) => any,
  updateOwnershipPercentage: (percentage: number) => any,
  toggleFreeze: () => any,
  addGeneralPermissionModule: () => any,
  archiveGeneralPermissionModule: () => any,
|};

const mapStateToProps = (state: RootState) => ({
  investors: state.whitelist.investors,
  criticals: state.whitelist.criticals,
  stateListLength: state.whitelist.listLength,
  token: state.token.token,
  isPercentageEnabled: !!state.whitelist.percentageTM.contract,
  isPercentagePaused: state.whitelist.percentageTM.isPaused,
  percentage: state.whitelist.percentageTM.percentage,
  isTokenFrozen: state.whitelist.freezeStatus,
  isWhitelistToggled: state.whitelist.isToggled,
  isApprovalToggled: state.whitelist.isApprovalToggled,
});

const mapDispatchToProps = {
  fetchWhitelist,
  listLength,
  addInvestor,
  importWhitelist,
  exportWhitelist,
  editInvestors,
  removeInvestors,
  resetUploaded,
  reset,
  confirm,
  disableOwnershipRestrictions,
  enableOwnershipRestrictions,
  updateOwnershipPercentage,
  toggleFreeze,
  fetchManagers,
  toggleWhitelistManagement,
  addGeneralPermissionModule,
  archiveGeneralPermissionModule,
  addManualApprovalModule,
  archiveManualApprovalModule,
  fetchApprovals,
};

type Props = StateProps & DispatchProps;

type State = {|
  page: number,
  editInvestors: Array<Address>,
  isAddModalOpen: boolean,
  isEditModalOpen: boolean,
  isImportModalOpen: boolean,
  startDateAdded: ?Date,
  endDateAdded: ?Date,
  isPercentageToggled: boolean,
  isWhitelistToggled: boolean,
  isWhitelistModalOpen: boolean,
  percentage: ?number,
|};

const dateFormat = (date: ?Date): string => {
  if (!date) {
    return '';
  }
  if (date.getTime() === PERMANENT_LOCKUP_TS) {
    return 'Permanent';
  }
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export class CompliancePage extends Component<Props, State> {
  state = {
    page: 0,
    editInvestors: [],
    isAddModalOpen: false,
    isEditModalOpen: false,
    isImportModalOpen: false,
    startDateAdded: null,
    endDateAdded: null,
    isPercentageToggled: false,
    percentage: undefined,
  };

  componentWillMount() {
    this.props.fetchWhitelist();
    if (this.props.percentage) {
      this.setState({ percentage: this.props.percentage });
    }
    this.props.fetchManagers();
    this.props.fetchApprovals();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.percentage !== this.props.percentage &&
      nextProps.percentage !== null
    ) {
      this.setState({ percentage: nextProps.percentage });
    }
  }

  handleChangePages = pc => {
    this.props.listLength(pc.pageSize);
    this.setState({
      page: pc.page - 1,
    });
  };

  handleDateAddedChange = (picker: [Date, Date]) => {
    this.setState({
      page: 0,
      startDateAdded: picker[0],
      endDateAdded: picker[1],
    });
  };

  handleAddModalOpen = () => {
    this.props.reset(addInvestorFormName);
    this.setState({ isAddModalOpen: true });
  };

  handleAddModalClose = () => {
    this.setState({ isAddModalOpen: false });
  };

  handleAddInvestorSubmit = () => {
    this.handleAddModalClose();
    this.props.addInvestor();
  };

  handleFreezeModalOpen = () => {
    // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
          Once you hit &laquo;CONFIRM&raquo;, the freeze on all transfers will
          PREVENT ANY INVESTOR FROM BUYING OR SELLING YOUR TOKENS UNTIL YOU
          RESUME TRANSFERS. Consider notifying all your investors. If you wish
          to review with your Advisors, please select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      () => {
        this.props.toggleFreeze();
      },
      'Pause All Transfers?'
    );
  };

  handleUnFreezeModalOpen = () => {
    // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
          Once you hit &laquo;CONFIRM&raquo;, token transfers WILL BE ENABLED
          AGAIN, ALLOWING ANY AUTHORIZED INVESTOR TO BUY OR SELL YOUR TOKENS.
          Consider notifying all your investors. If you wish to review with your
          Advisors, please select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      () => {
        this.props.toggleFreeze();
      },
      'Resume All Transfers?'
    );
  };

  handleImportModalOpen = () => {
    this.props.resetUploaded();
    this.setState({ isImportModalOpen: true });
  };

  handleImportModalClose = () => {
    this.setState({ isImportModalOpen: false });
  };

  handleImport = () => {
    const { criticals, isPercentagePaused } = this.props; // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
          Please confirm that all previous information is correct and all
          investors are approved. Once you hit &laquo;CONFIRM&raquo;, investors
          will be submitted to the blockchain. Any change will require that you
          start the process over. If you wish to review your information, please
          select &laquo;CANCEL&raquo;.
        </p>
        {criticals.length ? (
          <div>
            <InlineNotification
              hideCloseButton
              title={
                criticals.length +
                ' Error' +
                (criticals.length > 1 ? 's' : '') +
                ' in Your .csv File'
              }
              subtitle={
                'Please note that the entries below contains error or duplicates another entry that prevent ' +
                'their content to be committed to the blockchain. Entries were automatically deselected so they are ' +
                'not submitted to the blockchain. You can also elect to cancel the operation to review the csv ' +
                'file offline.'
              }
              kind="error"
            />
          </div>
        ) : (
          ''
        )}
      </div>,
      () => {
        this.props.importWhitelist();
      },
      undefined,
      undefined,
      criticals.length > 0 ? 'whitelist-import-confirm-modal' : ''
    );
  };

  handleExport = () => {
    // $FlowFixMe TODO @bshevchenko
    this.props.confirm(
      <p>
        Are you sure you want to export whitelist?
        <br />
        Please be aware that the time to complete this operation will vary based
        on the number of entries in the list.
      </p>,
      () => {
        this.props.exportWhitelist();
      },
      'Proceeding with Whitelist Export'
    );
  };

  handleBatchEdit = (selectedRows: Array<Object>) => {
    const addresses = [];
    for (let i = 0; i < selectedRows.length; i++) {
      addresses.push(selectedRows[i].cells[0].value);
    }
    this.props.reset(editInvestorsFormName);
    this.setState({
      isEditModalOpen: true,
      editInvestors: addresses,
    });
  };

  handleEditSubmit = () => {
    this.props.editInvestors(this.state.editInvestors);
    this.setState({
      isEditModalOpen: false,
    });
  };

  handleEditModalClose = () => {
    this.setState({
      isEditModalOpen: false,
    });
  };

  handleBatchDelete = (selectedRows: Array<Object>) => {
    let addresses = [];
    for (let i = 0; i < selectedRows.length; i++) {
      addresses.push(selectedRows[i].cells[0].value);
    }
    this.props.removeInvestors(addresses);
  };

  handleToggleWhitelist = async (isToggled: boolean) => {
    if (isToggled) {
      await this.props.addGeneralPermissionModule();
    } else {
      await this.props.archiveGeneralPermissionModule();
    }
  };

  handleToggleApproval = async (isToggled: boolean) => {
    if (isToggled) {
      await this.props.addManualApprovalModule();
    } else {
      await this.props.archiveManualApprovalModule();
    }
  };

  handleTogglePercentage = (isToggled: boolean) => {
    const { isPercentageEnabled, isPercentagePaused } = this.props;
    if (!isPercentageEnabled) {
      this.setState({ isPercentageToggled: isToggled });
    } else {
      if (isPercentagePaused) {
        this.props.enableOwnershipRestrictions();
      } else {
        this.props.disableOwnershipRestrictions();
      }
    }
  };

  handlePercentageChange = event => {
    let value = parseInt(Number(event.target.value), 10);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      event.preventDefault();
      this.setState({ percentage: '' });
      return;
    }
    if (event.target.value === '') {
      value = undefined;
    }
    this.setState({ percentage: value });
  };

  handleApplyPercentage = () => {
    const { isPercentageEnabled } = this.props;
    if (isPercentageEnabled) {
      // $FlowFixMe
      this.props.updateOwnershipPercentage(this.state.percentage);
    } else {
      // $FlowFixMe
      this.props.enableOwnershipRestrictions(this.state.percentage);
    }
  };

  paginationRendering() {
    const {
      investors,
      stateListLength,
      isPercentagePaused,
      percentage,
    } = this.props;
    const pageNum = this.state.page;
    const startSlice = pageNum * stateListLength;
    const endSlice = (pageNum + 1) * stateListLength;
    const paginated = investors.slice(startSlice, endSlice);
    const stringified = [];
    for (let investor of paginated) {
      // filter by date added
      if (
        // $FlowFixMe
        (this.state.startDateAdded &&
          investor.added < this.state.startDateAdded) ||
        // $FlowFixMe
        (this.state.endDateAdded && investor.added > this.state.endDateAdded)
      ) {
        continue;
      }
      stringified.push({
        id: investor.address,
        address: investor.address,
        added: investor.added ? dateFormat(investor.added) : null,
        addedBy: investor.addedBy,
        from: dateFormat(investor.from),
        to: dateFormat(investor.to),
        expiry: dateFormat(investor.expiry), // $FlowFixMe
        ...(!isPercentagePaused
          ? {
              percentage: investor.bypassPercentageRestriction
                ? percentage + '%'
                : 'No Limit',
            }
          : {}),
      });
    }
    return stringified;
  }

  dataTableRender = ({
    rows,
    headers,
    getHeaderProps,
    getSelectionProps,
    getBatchActionProps,
    onInputChange,
    selectedRows,
  }) => (
    <TableContainer>
      <TableToolbar>
        <TableBatchActions {...getBatchActionProps()}>
          <Button
            icon="delete"
            iconDescription="Delete"
            onClick={() => this.handleBatchDelete(selectedRows)}
          >
            Delete
          </Button>
          <Button
            icon="edit"
            iconDescription="Edit Dates"
            onClick={() => this.handleBatchEdit(selectedRows)}
          >
            Edit
          </Button>
        </TableBatchActions>
        <TableToolbarSearch onChange={onInputChange} />
        <TableToolbarContent>
          <Button icon="add--glyph" onClick={this.handleAddModalOpen} small>
            Add New
          </Button>
          <Modal
            className="whitelist-investor-modal"
            open={this.state.isAddModalOpen}
            onRequestClose={this.handleAddModalClose}
            modalHeading="Add New Investor"
            passiveModal
          >
            <p className="bx--modal-content__text">
              Add individual addresses to the whitelist by inputting their ETH
              Address below.
            </p>
            <br />
            <AddInvestorForm
              onSubmit={this.handleAddInvestorSubmit}
              onClose={this.handleAddModalClose}
            />
          </Modal>
        </TableToolbarContent>
      </TableToolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableSelectAll {...getSelectionProps()} />
            {headers.map(header => (
              <TableHeader {...getHeaderProps({ header })}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableSelectRow {...getSelectionProps({ row })} />
              {row.cells.map((cell, i) => (
                <TableCell key={cell.id}>
                  {i === 0 ? (
                    <div>
                      {etherscanAddress(
                        cell.value,
                        this.props.isPercentagePaused
                          ? cell.value
                          : addressShortifier(cell.value)
                      )}
                    </div>
                  ) : i === 2 ? (
                    <div>
                      {etherscanAddress(
                        cell.value,
                        addressShortifier(cell.value)
                      )}
                    </div>
                  ) : i === (this.props.isPercentagePaused ? 6 : 7) ? (
                    <div>
                      <Icon
                        name="edit--glyph"
                        style={{ cursor: 'pointer' }}
                        fill="#889BAA"
                        width="24"
                        height="24"
                        description="Edit"
                        onClick={() => this.handleBatchEdit([row])}
                      />
                      &nbsp; &nbsp;
                      <Icon
                        name="delete--glyph"
                        style={{ cursor: 'pointer' }}
                        fill="#889BAA"
                        width="24"
                        height="24"
                        description="Delete"
                        onClick={() => this.handleBatchDelete([row])}
                      />
                    </div>
                  ) : (
                    <div>{cell.value}</div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  isPercentageValid = () => {
    if (this.state.percentage && this.props.percentage) {
      return (
        new BigNumber(this.state.percentage).toNumber() ===
        new BigNumber(this.props.percentage).toNumber()
      );
    }
  };

  render() {
    const { token, isPercentageEnabled, isPercentagePaused } = this.props;
    if (!token || !token.address) {
      return <NotFoundPage />;
    }
    // const paginatedRows = this.paginationRendering()
    return (
      <Page title="Compliance – Polymath">
        <Progress />
        <h1 className="pui-h1">Token Compliance</h1>
        <h3 className="pui-h3">
          Manage compliance requirements of your tokens. You can import and
          export your whitelist, manage ownership percentages and add 3rd party
          whitelist managers.
        </h3>
        <Tabs>
          <Tab label="Whitelist">
            <Grid>
              <Grid.Row>
                <Grid.Col gridSpan={9}>
                  <h1 className="pui-h1">Whitelist</h1>
                  <h3 className="pui-h3">
                    Your whitelist is the list of wallet addresses of approved
                    or exempted to buy and sell your security token.
                  </h3>
                  <Remark title="Note">
                    Security token buy/sell operations may be subject to
                    additional restrictions.
                  </Remark>
                </Grid.Col>
                <Grid.Col style={{ alignSelf: 'center' }}>
                  <Button
                    style={{ width: 185 }}
                    icon="upload"
                    onClick={this.handleImportModalOpen}
                    className="import-whitelist-btn"
                  >
                    Import Whitelist
                  </Button>
                </Grid.Col>
                <Grid.Col style={{ alignSelf: 'center' }}>
                  <ImportWhitelistModal
                    isOpen={this.state.isImportModalOpen}
                    onSubmit={this.handleImport}
                    onClose={this.handleImportModalClose}
                  />

                  <Button
                    style={{ width: 185 }}
                    icon="download"
                    kind="secondary"
                    onClick={this.handleExport}
                    className="import-whitelist-btn"
                  >
                    Export Whitelist
                  </Button>
                </Grid.Col>
                <Grid.Col style={{ alignSelf: 'center', justifySelf: 'left' }}>
                  <OverflowMenu floatingMenu flipped style={{ float: 'right' }}>
                    <OverflowMenuItem
                      itemText={
                        this.props.isTokenFrozen
                          ? 'Resume All Transfers'
                          : 'Pause All Transfers'
                      }
                      onClick={
                        this.props.isTokenFrozen
                          ? this.handleUnFreezeModalOpen
                          : this.handleFreezeModalOpen
                      }
                    />
                  </OverflowMenu>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col gridSpan={[12, 12, 6, 6]}>
                  <div id="compliance">
                    <br />
                    <div className="pui-page-box compliance-form">
                      <h1 className="pui-h1">3rd Party Whitelist Management</h1>
                      <div className="whitelist-settings">
                        <div className="bx--form-item">
                          <label
                            htmlFor="whitelistToggle"
                            className="bx--label"
                          >
                            Enable Third-Party Whitelist Management
                          </label>
                          <Toggle
                            onToggle={this.handleToggleWhitelist}
                            toggled={this.props.isWhitelistToggled}
                            id="whitelistToggle"
                          />
                        </div>
                        <div
                          className="bx--form-item"
                          style={
                            this.props.isWhitelistToggled
                              ? {}
                              : { display: 'none' }
                          }
                        >
                          <WhitelistTable />
                        </div>
                      </div>
                      <div className="pui-clearfix" />
                    </div>
                  </div>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Tab>
          <Tab label="Ownership Restrictions">
            <Grid>
              <Grid.Row>
                <Grid.Col gridSpan={9}>
                  <h1 className="pui-h1">Ownership Restrictions</h1>
                  <h3 className="pui-h3">
                    Manage ownership of your security token by setting limits
                    like capping the percentage of available tokens a single
                    investor can hold.{' '}
                  </h3>
                  <Remark title="Note">
                    This percentage relates to the holdings of a single wallet
                    address and may not support investor holdings held in a
                    custodial omnibus wallet.
                  </Remark>
                  <br />
                  <div
                    className="bx--form-item"
                    style={
                      !isPercentagePaused ||
                      (!isPercentageEnabled && this.state.isPercentageToggled)
                        ? {}
                        : {
                            display: 'none',
                          }
                    }
                  >
                    <label htmlFor="percentage" className="bx--label">
                      Percentage of outstanding tokens individual investors can
                      own:
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <TextInput
                        style={{ width: 100 }}
                        labelText=""
                        id="percentage"
                        value={this.state.percentage}
                        placeholder="%"
                        onChange={this.handlePercentageChange}
                      />
                      <Button
                        style={{ marginTop: 0 }}
                        kind="secondary"
                        className="apply-percentage-btn"
                        onClick={this.handleApplyPercentage}
                        disabled={
                          this.isPercentageValid() ||
                          typeof this.state.percentage === 'undefined' ||
                          this.state.percentage === ''
                        }
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </Grid.Col>
                <Grid.Col
                  gridSpan={3}
                  style={{
                    alignSelf: 'center',
                    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
                  }}
                >
                  <CardFeatureState
                    status={
                      isPercentageEnabled
                        ? !isPercentagePaused
                        : this.state.isPercentageToggled
                        ? 'idle'
                        : 'inactive'
                    }
                    IconAsset={icons.SvgRestriction}
                  >
                    <Heading color="primary" mt={2}>
                      Enable Ownership Restrictions
                    </Heading>
                    <div style={{ marginLeft: 70 }}>
                      <Toggle
                        onToggle={this.handleTogglePercentage}
                        toggled={
                          isPercentageEnabled
                            ? !isPercentagePaused
                            : this.state.isPercentageToggled
                        }
                        id="volumeRestrictionToggle"
                      />
                    </div>
                  </CardFeatureState>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Tab>
          {token.contract.version >= '3.0.0' && (
            <Tab label="Manual Approval">
              <Grid>
                <Grid.Row>
                  <Grid.Col gridSpan={[12, 12, 12, 12]}>
                    <div id="compliance">
                      <br />
                      <div className="pui-page-box compliance-form">
                        <h1 className="pui-h1">Manual Trade Approvals</h1>
                        <p>
                          Allows you to pre-approve token trades between two
                          wallet addresses for a period of time. You can always
                          edit and remove trade approvals. Note that these
                          approvals supercede all other exemptions and
                          restrictions for a particular wallet.
                        </p>
                        <div className="whitelist-settings">
                          <div className="bx--form-item">
                            <label
                              htmlFor="approvalToggle"
                              className="bx--label"
                            >
                              Enable Manual Trade Approvals
                            </label>
                            <Toggle
                              onToggle={this.handleToggleApproval}
                              toggled={this.props.isApprovalToggled}
                              id="approvalToggle"
                            />
                          </div>

                          <div
                            className="bx--form-item"
                            style={
                              this.props.isApprovalToggled
                                ? {}
                                : { display: 'none' }
                            }
                          >
                            <ApprovalTable />
                          </div>
                        </div>
                        <div className="pui-clearfix" />
                      </div>
                    </div>
                  </Grid.Col>
                </Grid.Row>
              </Grid>
            </Tab>
          )}
        </Tabs>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompliancePage);
