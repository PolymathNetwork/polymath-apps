// @flow

import React from 'react';
import * as ui from '@polymathnetwork/ui';
import moment from 'moment';
import FileSaver from 'file-saver';
import { map, each } from 'lodash';
import semver from 'semver';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import BigNumber from 'bignumber.js';
import { SecurityToken, PercentageTransferManager } from '@polymathnetwork/js';
import { toWei } from '../utils/contracts';
import { formName as addInvestorFormName } from '../pages/compliance/components/AddInvestorForm';
import { formName as editInvestorsFormName } from '../pages/compliance/components/EditInvestorsForm';
import CSVFileValidator from '../utils/parsers/csv-file-validator';
import {
  validateAddress,
  validateDate,
  validateError,
  requiredError,
  uniqueError,
  headerError,
} from '../utils/parsers/common';

import { STAGE_OVERVIEW } from '../reducers/sto';
import { PERM_TYPES } from '../constants';
import Web3 from 'web3';

import type { Investor, Address } from '@polymathnetwork/js/types';
import type { GetState } from '../redux/reducer';

export const PERMANENT_LOCKUP_TS = 67184812800000; // milliseconds

export const TRANSFER_MANAGER = 'compliance/TRANSFER_MANAGER';
export const WHITELIST = 'compliance/WHITELIST';
export const UPLOAD_START = 'compliance/UPLOAD_START';
export const UPLOAD_ONLOAD = 'compliance/UPLOAD_ONLOAD';
export const UPLOADED = 'compliance/UPLOADED';

export const PERCENTAGE_TM = 'compliance/PERCENTAGE_TM';
export const percentageTransferManager = (
  tm: PercentageTransferManager,
  isPaused: boolean,
  percentage?: number
) => ({ type: PERCENTAGE_TM, tm, isPaused, percentage });

export const LIST_LENGTH = 'compliance/WHITELIST_LENGTH';
export const listLength = (listLength: number) => ({
  type: LIST_LENGTH,
  listLength,
});

export const LOAD_MANAGERS = 'compliance/LOAD_MANAGERS';
export const loadManagers = managers => ({
  type: LOAD_MANAGERS,
  managers,
});

export const LOAD_APPROVALS = 'compliance/LOAD_APPROVALS';
export const loadApprovals = approvals => ({
  type: LOAD_APPROVALS,
  approvals,
});

export const ADD_APPROVAL = 'compliance/ADD_APPROVAL';
export const addApproval = approval => ({
  type: ADD_APPROVAL,
  approval,
});

export const REMOVE_APPROVAL = 'compliance/REMOVE_APPROVAL';
export const removeApproval = id => ({
  type: REMOVE_APPROVAL,
  id,
});

export const EDIT_APPROVAL = 'compliance/EDIT_APPROVAL';
export const editApproval = approval => ({
  type: EDIT_APPROVAL,
  approval,
});

export const MODIFY_APPROVALS = 'compliance/MODIFY_APPROVALS';
export const modifyApprovals = approval => ({
  type: MODIFY_APPROVALS,
  approval,
});

export const ADD_MANAGER = 'compliance/ADD_MANAGER';
export const addManager = manager => ({
  type: ADD_MANAGER,
  manager,
});

export const REMOVE_MANAGER = 'compliance/REMOVE_MANAGER';
export const removeManager = address => ({
  type: REMOVE_MANAGER,
  address,
});

export const TOGGLE_WHITELIST_MANAGEMENT =
  'compliance/TOGGLE_WHITELIST_MANAGEMENT';
export const toggleWhitelistManagement = (isToggled: boolean) => ({
  type: TOGGLE_WHITELIST_MANAGEMENT,
  isToggled,
});

export const TOGGLE_APPROVAL_MANAGER = 'compliance/TOGGLE_APPROVAL_MANAGER';
export const toggleApprovalManager = (isToggled: boolean) => ({
  type: TOGGLE_APPROVAL_MANAGER,
  isToggled,
});

export const RESET_UPLOADED = 'compliance/RESET_UPLOADED';
export const resetUploaded = () => ({ type: RESET_UPLOADED });

export const FREEZE_STATUS = 'compliance/FREEZE_STATUS';
export const FROZEN_MODAL_STATUS = 'compliance/FROZEN_MODAL_STATUS';
export const showFrozenModal = (show: boolean) => ({
  type: FROZEN_MODAL_STATUS,
  show,
});

export type InvestorCSVRow = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
];

// make more functional and switch transfermanager to module
async function getDelegateDetails(permissionManager, transferManager) {
  const delegates = await permissionManager.getAllDelegates(
    transferManager.address,
    PERM_TYPES.ADMIN
  );
  let delegateDetails = [];
  for (const delegate of delegates) {
    let details = await permissionManager.getDelegateDetails(delegate);
    delegateDetails.push({ id: delegate, address: delegate, details });
  }
  return delegateDetails;
}

export const fetchManagers = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  // $FlowFixMe
  try {
    const st: SecurityToken = getState().token.token.contract;
    const permissionManager = await st.getPermissionManager();
    if (!permissionManager) {
      return;
    }
    const moduleMetadata = await st.getModule(permissionManager.address);
    if (permissionManager && !moduleMetadata.isArchived) {
      const transferManager = await st.getTransferManager();
      if (transferManager) {
        const delegateDetails = await getDelegateDetails(
          permissionManager,
          transferManager
        );
        dispatch(loadManagers(delegateDetails));
      }
      dispatch(toggleWhitelistManagement(true));
    } else {
      dispatch(toggleWhitelistManagement(false));
    }
    dispatch(ui.fetched());
  } catch (e) {
    console.log(e);
  }
};

export const addAddressToTransferManager = (
  delegate: Address,
  details: string
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  const permissionManager = await st.getPermissionManager();
  const titles = ['Adding New Whitelist Manager', 'Setting Permissions'];
  const isDelegate = await permissionManager.checkDelegate(delegate);
  if (isDelegate) {
    titles.shift();
  }
  dispatch(
    ui.tx(
      titles,
      async () => {
        if (permissionManager) {
          const transferManager = await st.getTransferManager();
          if (transferManager) {
            if (!isDelegate) {
              await permissionManager.addDelegate(delegate, details);
            }
            await permissionManager.changePermission(
              delegate,
              transferManager.address,
              PERM_TYPES.ADMIN,
              true
            );
          }
        }
      },
      'New Whistlist Manager Added',
      () => {
        dispatch(addManager({ address: delegate, details: details }));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

// TODO: Add confirm dialog box
export const removeAddressFromTransferManager = (delegate: Address) => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <div>
        <p>
          Once removed, the whitelist manager will no longer have permission to
          update the whitelist. Consult your legal team before removing a wallet
          from the list.
        </p>
      </div>,
      async () => {
        dispatch(
          ui.tx(
            ['Removing Whitelist Manager'],
            async () => {
              const st: SecurityToken = getState().token.token.contract;
              const permissionManager = await st.getPermissionManager();
              if (permissionManager) {
                const transferManager = await st.getTransferManager();
                if (transferManager) {
                  await permissionManager.changePermission(
                    delegate,
                    transferManager.address,
                    PERM_TYPES.ADMIN,
                    false
                  );
                }
              }
            },
            'Whitelist Manager Removed',
            () => {
              dispatch(removeManager(delegate));
            },
            undefined,
            undefined,
            undefined,
            true
          )
        );
      },
      `Remove the Whitelist Manager from the Whitelist Managers List?`,
      undefined,
      'pui-large-confirm-modal'
    )
  );
};

export const archiveGeneralPermissionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Disabling General Permissions Manager'],
      async () => {
        const permissionManager = await st.getPermissionManager();
        await st.archiveModule(permissionManager.address);
      },
      'General Permissions Manager Disabled',
      () => {
        dispatch(toggleWhitelistManagement(false));
        dispatch(loadManagers([]));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const addGeneralPermissionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const permissionManager = await st.getPermissionManager();
  const transferManager = await st.getTransferManager();
  let moduleMetadata = {};
  let delegateDetails = [];

  if (permissionManager)
    moduleMetadata = await st.getModule(permissionManager.address);

  dispatch(
    ui.tx(
      ['Enabling General Permissions Manager for General Transfer Manager'],
      async () => {
        if (moduleMetadata.isArchived) {
          await st.unarchiveModule(permissionManager.address);
          delegateDetails = await getDelegateDetails(
            permissionManager,
            transferManager
          );
        } else {
          await st.setPermissionManager();
        }
      },
      'General Permissions Manager for General Transfer Manager Enabled',
      () => {
        dispatch(loadManagers(delegateDetails));
        dispatch(toggleWhitelistManagement(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const fetchWhitelist = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  try {
    if (!getState().whitelist.transferManager) {
      // $FlowFixMe
      const st: SecurityToken = getState().token.token.contract;
      const transferManager = await st.getTransferManager();

      dispatch({
        type: TRANSFER_MANAGER,
        transferManager,
      });

      const percentageTM = await st.getPercentageTM();
      if (percentageTM) {
        dispatch(
          percentageTransferManager(
            percentageTM,
            await percentageTM.paused(),
            await percentageTM.maxHolderPercentage()
          )
        );
      }
    }

    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const maxRows = 75;
  const reader = new FileReader();

  dispatch({ type: UPLOAD_START });

  reader.readAsText(file);

  reader.onload = async () => {
    dispatch({ type: UPLOAD_ONLOAD });

    const config = {
      headers: [
        {
          name: 'ETH Address',
          inputName: 'address',
          required: true,
          unique: true,
          validate: function(val) {
            return validateAddress(val);
          },
          validateError,
          headerError,
          uniqueError,
          requiredError,
        },
        {
          name: 'Sell Restriction Date',
          inputName: 'from',
          validate: function(val) {
            return val.length === 0 || validateDate(val);
          },
          validateError,
          headerError,
        },
        {
          name: 'Buy Restriction Date',
          inputName: 'to',
          validate: function(val) {
            return val.length === 0 || validateDate(val);
          },
          validateError,
          headerError,
        },
        {
          name: 'KYC/AML Expiry Date',
          inputName: 'expiry',
          required: true,
          validate: function(val) {
            return validateDate(val);
          },
          validateError,
          headerError,
          requiredError,
        },
        {
          name: 'Can Buy From STO',
          inputName: 'canBuyFromSTO',
          validate: function(val) {
            return val.length === 0 || val.toLowerCase() === 'true';
          },
          validateError,
          headerError,
        },
        {
          name: 'Exempt From % Ownership',
          inputName: 'bypassPercentageRestriction',
          validate: function(val) {
            return val.length === 0 || val.toLowerCase() === 'true';
          },
          validateError,
          headerError,
        },
        {
          name: 'Is Accredited',
          inputName: 'accredited',
          validate: function(val) {
            return val.length === 0 || val.toLowerCase() === 'true';
          },
          validateError,
          headerError,
        },
        {
          name: 'Non-Accredited Limit',
          inputName: 'nonAccreditedLimit',
          validate: function(val) {
            return val.length === 0 || !isNaN(val);
          },
          validateError,
          headerError,
        },
      ],
    };

    let isTooMany = false;
    let investors = [];

    try {
      const { data, validationErrors } = await CSVFileValidator(
        reader.result,
        config
      );
      isTooMany = data.length > 75;

      if (validationErrors.length) {
        dispatch({
          type: UPLOADED,
          investors: [],
          criticals: validationErrors,
          isTooMany,
          parseError: '',
        });
      } else {
        data.forEach(
          ({
            address,
            from,
            to,
            purchase,
            expiry,
            canBuyFromSTO,
            bypassPercentageRestriction,
            accredited,
            nonAccreditedLimit,
          }) => {
            investors.push({
              address,
              from: from.length
                ? new Date(from)
                : new Date(PERMANENT_LOCKUP_TS),
              to: to.length ? new Date(to) : new Date(PERMANENT_LOCKUP_TS),
              expiry: new Date(expiry),
              canBuyFromSTO: canBuyFromSTO.length ? true : false,
              bypassPercentageRestriction: bypassPercentageRestriction.length
                ? true
                : false,
              accredited: accredited.length ? true : false,
              nonAccreditedLimit: nonAccreditedLimit.length
                ? Number(nonAccreditedLimit)
                : null,
            });
          }
        );

        dispatch({
          type: UPLOADED,
          investors,
          criticals: validationErrors,
          isTooMany,
          parseError: '',
        });
      }
    } catch (error) {
      dispatch({
        type: UPLOADED,
        investors: [],
        criticals: [],
        isTooMany,
        parseError: error.message,
      });
    }
  };
};

export const importWhitelist = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const {
    whitelist: {
      uploaded,
      transferManager,
      percentageTM: { contract: percentageTM, isPaused: isPercentageDisabled },
    },
    sto,
  } = getState();
  const st = getState().token.token.contract;
  const isPTMEnabled = !isPercentageDisabled;

  const titles = [];
  const transactions = [];

  titles.push('Submitting Approved Investors');
  transactions.push(() => transferManager.modifyKYCDataMulti(uploaded));
  if (isPTMEnabled) {
    titles.push('Setting ownership restrictions');
    transactions.push(() => percentageTM.modifyWhitelistMulti(uploaded));
  }

  /**
   * 2.x
   **/
  if (semver.lt(st.version, LATEST_PROTOCOL_VERSION)) {
    if (sto.stage === STAGE_OVERVIEW && sto.details.type === 'USDTieredSTO') {
      const statusAddresses = [];
      const statusValues = [];
      const limitAddresses = [];
      const limitValues = [];

      // Transform inputs for the transactions
      each(uploaded, ({ accredited, nonAccreditedLimit, address }) => {
        statusAddresses.push(address);
        statusValues.push(accredited);
        limitAddresses.push(address);
        limitValues.push(nonAccreditedLimit);
      });

      if (statusAddresses.length) {
        titles.push('Updating accredited investors');
        transactions.push(() =>
          sto.contract.changeAccredited(statusAddresses, statusValues)
        );
      }

      if (limitAddresses.length) {
        titles.push('Updating non-accredited investors limits');
        transactions.push(() =>
          sto.contract.changeNonAccreditedLimit(limitAddresses, limitValues)
        );
      }
    }
  } else {
    /**
     * 3.0
     */
    let addresses: Array<string> = [];
    let flags: Array<number> = [];
    let values: Array<boolean> = [];
    for (let investor of uploaded) {
      addresses.push(investor.address); // $FlowFixMe
      flags.push(1); // 1 = 'canNotBuyFromSto'
      // We're negating the value because 3.0 flag is negated too (ie can NOT buy from STO).
      values.push(!investor.canBuyFromSTO);
      addresses.push(investor.address); // $FlowFixMe
      flags.push(0); // 0 = 'isAccredited'
      values.push(investor.accredited);
    }

    if (sto.stage === STAGE_OVERVIEW && sto.details.type === 'USDTieredSTO') {
      const limitAddresses = [];
      const limitValues = [];

      // Transform inputs for the transactions
      each(uploaded, ({ accredited, nonAccreditedLimit, address }) => {
        if (nonAccreditedLimit !== null) {
          limitAddresses.push(address);
          limitValues.push(nonAccreditedLimit);
        }
      });

      if (limitAddresses.length) {
        titles.push('Updating non-accredited investors limits');
        transactions.push(() =>
          sto.contract.changeNonAccreditedLimit(limitAddresses, limitValues)
        );
      }
    }

    if (addresses.length) {
      titles.push('Modifying Investor Flags');
      transactions.push(() =>
        transferManager.modifyInvestorFlagMulti(addresses, flags, values)
      );
    }
  }

  dispatch(
    ui.tx(
      titles,
      async () => {
        for (const transaction of transactions) {
          await transaction();
        }
      },
      'Investors have been added successfully',
      () => {
        dispatch(resetUploaded());
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const exportWhitelist = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  try {
    const {
      whitelist: {
        transferManager,
        percentageTM: { contract: percentageTM, isPaused: PTMPaused },
      },
      sto,
    } = getState();

    const investors = await transferManager.getWhitelist();
    if (percentageTM && !PTMPaused) {
      const percentages = await percentageTM.getWhitelist();
      for (let i = 0; i < investors.length; i++) {
        for (let percentage of percentages) {
          if (investors[i].address === percentage.address) {
            investors[i].bypassPercentageRestriction =
              percentage.bypassPercentageRestriction;
          }
        }
      }
    }
    // eslint-disable-next-line max-len
    let csvContent =
      'ETH Address,Sell Restriction Date,Buy Restriction Date,KYC/AML Expiry Date,Can Buy From STO,Exempt From % Ownership,Is Accredited,Non-Accredited Limit';
    investors.forEach((investor: Investor) => {
      csvContent +=
        '\r\n' +
        [
          investor.address, // $FlowFixMe
          investor.from.getTime() === PERMANENT_LOCKUP_TS
            ? ''
            : moment(investor.from).format('MM/DD/YYYY'), // $FlowFixMe
          investor.to.getTime() === PERMANENT_LOCKUP_TS
            ? ''
            : moment(investor.to).format('MM/DD/YYYY'),
          moment(investor.expiry).format('MM/DD/YYYY'),
          investor.canBuyFromSTO ? 'true' : '',
          investor.bypassPercentageRestriction ? 'true' : '',
          investor.accredited ? 'true' : '',
          investor.nonAccreditedLimit
            ? investor.nonAccreditedLimit.toString()
            : '',
        ].join(',');
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    FileSaver.saveAs(blob, 'whitelist.csv');

    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

export const addInvestor = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const { values } = getState().form[addInvestorFormName];
  const investor: Investor = {
    address: values.address,
    from: new Date(values.permanentSale ? PERMANENT_LOCKUP_TS : values.sale),
    to: new Date(
      values.permanentPurchase ? PERMANENT_LOCKUP_TS : values.purchase
    ),
    expiry: new Date(values.expiry),
  };
  const {
    transferManager,
    percentageTM: { contract: percentageTM },
  } = getState().whitelist;

  dispatch(
    ui.tx(
      [
        'Submitting approved investor',
        ...(values.bypassPercentageRestriction
          ? ['Setting ownership restriction']
          : []),
      ],
      async () => {
        await transferManager.modifyKYCData(investor);
        if (values.bypassPercentageRestriction) {
          investor.bypassPercentageRestriction = true; // $FlowFixMe
          await percentageTM.modifyKYCData(investor);
        }
      },
      'Investor has been added successfully',
      () => {
        return dispatch(fetchWhitelist());
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const editInvestors = (addresses: Array<Address>) => async (
  dispatch: Function,
  getState: GetState
) => {
  const { values } = getState().form[editInvestorsFormName];
  const investor: Investor = {
    address: '', // we need e_ prefix to prevent names overlapping since we load both Add and Edit forms simultaneously
    from: new Date(
      values['e_permanentSale'] ? PERMANENT_LOCKUP_TS : values.sale
    ),
    to: new Date(
      values['e_permanentPurchase'] ? PERMANENT_LOCKUP_TS : values.purchase
    ),
    expiry: new Date(values.expiry),
    bypassPercentageRestriction: values['e_isPercentage'] || false,
  };
  const investors = [];
  for (let i = 0; i < addresses.length; i++) {
    investors.push({ ...investor, address: addresses[i] });
  }
  const {
    transferManager,
    percentageTM: { contract: percentageTM, isPaused: isPercentageDisabled },
  } = getState().whitelist;

  dispatch(
    ui.tx(
      [
        'Updating lockup dates',
        ...(!isPercentageDisabled ? ['Updating ownership restrictions'] : []),
      ],
      async () => {
        await transferManager.modifyKYCDataMulti(investors);
        if (!isPercentageDisabled) {
          // $FlowFixMe
          await percentageTM.modifyWhitelistMulti(investors);
        }
      },
      'Lockup dates has been updated successfully',
      () => {
        return dispatch(fetchWhitelist());
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const removeInvestors = (addresses: Array<Address>) => async (
  dispatch: Function,
  getState: GetState
) => {
  const investors: Array<Investor> = [];
  for (let i = 0; i < addresses.length; i++) {
    const removeInvestor: Investor = {
      address: addresses[i],
      from: new Date(0),
      to: new Date(0),
      expiry: new Date(0),
    };
    investors.push(removeInvestor);
  }
  const { transferManager } = getState().whitelist;
  const plural = addresses.length > 1 ? 's' : '';

  dispatch(
    ui.tx(
      `Removing investor${plural}`,
      async () => {
        await transferManager.modifyKYCDataMulti(investors);
      },
      `Investor${plural} has been removed successfully`,
      () => {
        return dispatch(fetchWhitelist());
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const enableOwnershipRestrictions = (percentage?: number) => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <div>
        <p>
          Please confirm that you want to enable Percentage Ownership
          Restrictions. This operation requires a wallet transaction to pay for
          the mining fee.
        </p>
        <p>
          Once you hit &laquo;CONFIRM&raquo;, Percentage Ownership Restrictions
          will be enabled. If you would like to disable Percentage Ownership
          Restrictions, you can toggle it off. This operation will also require
          a wallet transaction to pay for the mining fee. If you do not wish to
          enable Percentage Ownership Restrictions or wish to review your
          information, simply hit &laquo;CANCEL&raquo;.
        </p>
        <br />
        <ui.Remark title="Note">
          Please make sure to enable this functionality after some amount of
          tokens has been minted for your reserve or your affiliates. Percentage
          Ownership is calculated based on the token total supply. As such, if
          zero tokens have been minted, no transaction will be allowed as it
          would result in the Investor owning 100% of the total supply.
        </ui.Remark>
      </div>,
      async () => {
        // $FlowFixMe
        const tm = getState().whitelist.percentageTM.contract;
        if (tm) {
          dispatch(
            ui.tx(
              'Re-enabling ownership restrictions',
              async () => {
                await tm.unpause();
              },
              'Ownership restrictions has been re-enabled successfully',
              () => {
                dispatch(percentageTransferManager(tm, false));
                return dispatch(fetchWhitelist());
              },
              undefined,
              undefined,
              undefined,
              true // TODO @bshevchenko
            )
          );
        } else {
          // $FlowFixMe
          const st: SecurityToken = getState().token.token.contract;
          dispatch(
            ui.tx(
              'Enabling ownership restrictions',
              async () => {
                await st.setPercentageTM(percentage);
              },
              'Ownership restrictions has been enabled successfully',
              async () => {
                dispatch(
                  percentageTransferManager(
                    await st.getPercentageTM(),
                    false,
                    percentage
                  )
                );
              },
              undefined,
              undefined,
              undefined,
              true // TODO @bshevchenko
            )
          );
        }
      }
    )
  );
};

export const disableOwnershipRestrictions = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <div>
        <p>
          Please confirm that you want to disable the restrictions on Percentage
          Ownership. This operation requires a wallet transaction to pay for the
          mining fee (aka gas fee).
        </p>
        <p>
          Once you hit &laquo;CONFIRM&raquo;, restrictions on Percentage
          Ownership will be disabled. Re-enabling restrictions on Percentage
          Ownership will require a new wallet transaction to pay for the mining
          fee. If you wish to maintain existing Percentage Ownership
          restrictions or review your information, simply select
          &laquo;CANCEL&raquo;.
        </p>
      </div>,
      async () => {
        const tm = getState().whitelist.percentageTM.contract;
        dispatch(
          ui.tx(
            'Disabling ownership restrictions',
            async () => {
              // $FlowFixMe
              await tm.pause();
            },
            'Ownership restrictions has been disabled successfully',
            async () => {
              dispatch(percentageTransferManager(tm, true));
            },
            undefined,
            undefined,
            undefined,
            true // TODO @bshevchenko
          )
        );
      }
    )
  );
};

export const updateOwnershipPercentage = (percentage: number) => async (
  dispatch: Function,
  getState: GetState
) => {
  const tm = getState().whitelist.percentageTM.contract;
  dispatch(
    ui.tx(
      'Updating ownership percentage',
      async () => {
        // $FlowFixMe
        await tm.changeHolderPercentage(percentage);
      },
      'Ownership percentage has been successfully updated',
      async () => {
        dispatch(percentageTransferManager(tm, false, percentage));
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const toggleFreeze = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const { freezeStatus } = getState().whitelist;
  dispatch(
    ui.tx(
      [freezeStatus ? 'Resuming Token Transfers' : 'Pausing Token Transfers'],
      async () => {
        if (freezeStatus) {
          // $FlowFixMe
          await getState().token.token.contract.unfreezeTransfers();
        } else {
          // $FlowFixMe
          await getState().token.token.contract.freezeTransfers();
        }
      },
      freezeStatus
        ? 'Successfully Resumed Token Transfers'
        : 'Successfully Paused Token Transfers',
      () => {
        dispatch(showFrozenModal(!freezeStatus));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const addManualApprovalModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const approvalManager = await st.getApprovalManager();
  let moduleMetadata = {};
  let delegateDetails = [];

  if (approvalManager)
    moduleMetadata = await st.getModule(approvalManager.address);

  dispatch(
    ui.tx(
      ['Enabling Manual Trade Approvals'],
      async () => {
        if (moduleMetadata.isArchived) {
          await st.unarchiveModule(approvalManager.address);
          // delegateDetails = await getDelegateDetails(
          //   approvalManager,
          //   transferManager
          // );
        } else {
          await st.setApprovalManager();
        }
      },
      'Manual Trade Approvals Enabled',
      () => {
        // dispatch(loadManagers(delegateDetails));
        dispatch(toggleApprovalManager(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const archiveManualApprovalModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Disabling General Permissions Manager'],
      async () => {
        const approvalManager = await st.getApprovalManager();
        await st.archiveModule(approvalManager.address);
      },
      'General Permissions Manager Disabled',
      () => {
        dispatch(toggleApprovalManager(false));
        // dispatch(loadManagers([]));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const fetchApprovals = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  // $FlowFixMe
  try {
    const st: SecurityToken = getState().token.token.contract;
    const approvalManager = await st.getApprovalManager();
    if (!approvalManager) {
      return;
    }
    const moduleMetadata = await st.getModule(approvalManager.address);
    if (approvalManager && !moduleMetadata.isArchived) {
      const approvals = await approvalManager.getAllApprovals();
      dispatch(loadApprovals(approvals));
      dispatch(toggleApprovalManager(true));
    } else {
      dispatch(toggleApprovalManager(false));
    }
    dispatch(ui.fetched());
  } catch (e) {
    console.log(e);
  }
};

export const addManualApproval = (
  from,
  to,
  allowance,
  expiryTime,
  description
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Proceed with Adding Manual Approval'],
      async () => {
        const approvalManagerModule = await st.getApprovalManager();
        await approvalManagerModule.addManualApproval(
          from,
          to,
          allowance,
          expiryTime,
          description
        );
      },
      'Manual Approval Was Successfully Added',
      () => {
        const approval = {
          id: from + to,
          fromAddress: from,
          toAddress: to,
          expiry: expiryTime / 1000,
          tokens: Web3.utils.fromWei(allowance),
          tokensTransferred: '0',
          description: description,
        };
        dispatch(addApproval(approval));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const editManualApproval = (
  from,
  to,
  allowance,
  expiryTime,
  description
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  const editingApproval = getState().whitelist.editingApproval;
  const increase = editingApproval.tokens < allowance;
  dispatch(
    ui.tx(
      ['Proceed with Editing Manual Approval'],
      async () => {
        const approvalManagerModule = await st.getApprovalManager();
        await approvalManagerModule.modifyManualApproval(
          from,
          to,
          expiryTime,
          allowance,
          description,
          increase
        );
      },
      'Manual Approval Was Successfully Edited',
      () => {
        const approval = {
          id: from + to,
          fromAddress: from,
          toAddress: to,
          expiry: expiryTime / 1000,
          tokens: Web3.utils.fromWei(allowance),
          tokensTransferred: editingApproval.tokensTransferred,
          description: description,
        };
        dispatch(modifyApprovals(approval));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const removeApprovalFromApprovals = (id: Address) => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    // ui.confirm(
    //   <div>
    //     <p>
    //       Once removed, the whitelist manager will no longer have permission to
    //       update the whitelist. Consult your legal team before removing a wallet
    //       from the list.
    //     </p>
    //   </div>,
    async () => {
      dispatch(
        ui.tx(
          ['Removing Approval'],
          async () => {
            const st: SecurityToken = getState().token.token.contract;
            const approvals = getState().whitelist.approvals;
            const approvalToRemove = approvals.find(
              approval => approval.id === id
            );
            const approvalManager = await st.getApprovalManager();

            if (approvalManager) {
              await approvalManager.revokeManualApproval(
                approvalToRemove.fromAddress,
                approvalToRemove.toAddress
              );
            }
          },
          'Approval Removed',
          () => {
            dispatch(removeApproval(id));
          },
          undefined,
          undefined,
          undefined,
          true
        )
      );
    },
    `Remove the Whitelist Manager from the Whitelist Managers List?`,
    undefined,
    'pui-large-confirm-modal'
    // )
  );
};
