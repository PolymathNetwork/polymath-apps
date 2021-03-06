// @flow

import {
  TransferManager,
  PercentageTransferManager,
} from '@polymathnetwork/js';
import { CONTINUE as TX_CONTINUE } from '@polymathnetwork/ui/components/TxModal/actions';
import type { Investor } from '@polymathnetwork/js/types';

import * as a from '../actions/compliance';
import type { InvestorCSVRow } from '../actions/compliance';

export type WhitelistState = {|
  transferManager: TransferManager,
  percentageTM: {
    contract: ?PercentageTransferManager,
    isPaused: boolean,
    percentage: ?number,
  },
  investors: Array<Investor>,
  uploaded: Array<Investor>,
  criticals: Array<InvestorCSVRow>,
  isTooMany: boolean,
  parseError: String,
  listLength: number,
  freezeStatus: ?boolean,
  isFrozenModalOpen: ?boolean,
  approvedManagers: Array<any>,
  partialAddresses: Array<any>,
  fileUploaded: boolean,
  approvals: Array<any>,
|};

const defaultState: WhitelistState = {
  transferManager: null,
  percentageTM: {
    contract: null,
    isPaused: true,
    percentage: null,
  },
  investors: [],
  uploaded: [],
  criticals: [],
  isTooMany: false,
  parseError: '',
  listLength: 10,
  freezeStatus: null,
  isFrozenModalOpen: null,
  approvedManagers: [],
  isToggled: false,
  fileUploaded: false,
  isApprovalToggled: false,
  approvals: [],
  editingApproval: null,
  isPartialTransferToggled: false,
  partialAddresses: [],
};

// NOTE @RafaelVidaurre: WARNING For some reason this reducer is being renamed.

// eslint-disable-next-line complexity
export default (state: WhitelistState = defaultState, action: Object) => {
  switch (action.type) {
    case a.MODIFY_APPROVAL:
      let idx = state.approvals.findIndex(i => i.id === action.approval.id);
      return {
        ...state,
        approvals: [
          ...state.approvals.slice(0, idx),
          action.approval,
          ...state.approvals.slice(idx + 1),
        ],
      };
    case a.EDIT_APPROVAL:
      return {
        ...state,
        editingApproval: action.approval,
      };
    case a.REMOVE_APPROVAL:
      let ind = state.approvals.findIndex(i => i.id === action.id);
      return {
        ...state,
        approvals: [
          ...state.approvals.slice(0, ind),
          ...state.approvals.slice(ind + 1),
        ],
      };
    case a.ADD_APPROVAL:
      return {
        ...state,
        approvals: [
          ...state.approvals,
          {
            ...action.approval,
            id: (
              action.approval.fromAddress + action.approval.toAddress
            ).toLowerCase(),
          },
        ],
      };
    case a.LOAD_APPROVALS:
      return {
        ...state,
        approvals: action.approvals,
      };
    case a.TOGGLE_APPROVAL_MANAGER:
      return {
        ...state,
        isApprovalToggled: action.isToggled,
      };
    case a.ADD_PARTIAL_ADDRESS:
      return {
        ...state,
        partialAddresses: [...state.partialAddresses, { ...action.address }],
      };
    case a.LOAD_PARTIAL_ADDRESSES:
      return {
        ...state,
        partialAddresses: action.addresses,
      };
    case a.REMOVE_PARTIAL_ADDRESS:
      let y = state.partialAddresses.findIndex(
        i => i.address === action.address
      );
      return {
        ...state,
        partialAddresses: [
          ...state.partialAddresses.slice(0, y),
          ...state.partialAddresses.slice(y + 1),
        ],
      };
    case a.TOGGLE_WHITELIST_MANAGEMENT:
      return {
        ...state,
        isToggled: action.isToggled,
      };
    case a.TOGGLE_PARTIAL_TRANSFER:
      return {
        ...state,
        isPartialTransferToggled: action.isToggled,
      };
    case a.REMOVE_MANAGER:
      let index = state.approvedManagers.findIndex(
        i => i.address === action.address
      );
      return {
        ...state,
        approvedManagers: [
          ...state.approvedManagers.slice(0, index),
          ...state.approvedManagers.slice(index + 1),
        ],
      };
    case a.ADD_MANAGER:
      return {
        ...state,
        approvedManagers: [
          ...state.approvedManagers,
          { ...action.manager, id: action.manager.address },
        ],
      };
    case a.LOAD_MANAGERS:
      return {
        ...state,
        approvedManagers: action.managers,
      };
    case a.TRANSFER_MANAGER:
      return {
        ...state,
        transferManager: action.transferManager,
        percentageTM: defaultState.percentageTM,
      };
    case a.PERCENTAGE_TM:
      return {
        ...state,
        percentageTM: {
          contract: action.tm,
          isPaused: action.isPaused,
          percentage: action.percentage || state.percentageTM.percentage,
        },
      };
    case a.LIST_LENGTH:
      return {
        ...state,
        listLength: action.listLength,
      };
    case a.WHITELIST:
      return {
        ...state,
        investors: [...action.investors],
      };
    case a.UPLOADED:
      return {
        ...state,
        uploaded: action.investors,
        criticals: action.criticals,
        isTooMany: action.isTooMany,
        parseError: action.parseError,
        fileUploaded: true,
      };
    case a.RESET_UPLOADED:
      return {
        ...state,
        uploaded: [],
        criticals: [],
        isTooMany: false,
        parseError: '',
        fileUploaded: false,
      };
    case a.FREEZE_STATUS:
      return {
        ...state,
        freezeStatus: action.freezeStatus,
      };
    case a.FROZEN_MODAL_STATUS:
      return {
        ...state,
        isFrozenModalOpen: action.isFrozenModalOpen,
      };
    case TX_CONTINUE:
      if (state.freezeStatus) {
        return {
          ...state,
          isFrozenModalOpen: true,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};
