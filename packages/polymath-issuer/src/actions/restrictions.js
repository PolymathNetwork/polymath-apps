import * as ui from '@polymathnetwork/ui';
import web3 from 'web3';
import moment from 'moment';
import { parseWhitelistCsv } from '../utils/parsers/restrictionParser';

export const TOGGLE_RESTRICTIONS = 'restrictions/TOGGLE_RESTRICTIONS';
export const toggleRestrictions = isToggled => ({
  type: TOGGLE_RESTRICTIONS,
  isToggled,
});

export const IS_CUSTOM_RESTRICTION = 'restrictions/IS_CUSTOM_RESTRICTION';
export const setIsCustomRestriction = state => ({
  type: IS_CUSTOM_RESTRICTION,
  state,
});

export const IS_DAILY_RESTRICTION = 'restrictions/IS_DAILY_RESTRICTION';
export const setIsDailyRestriction = state => ({
  type: IS_DAILY_RESTRICTION,
  state,
});

export const DEFAULT_RESTRICTION = 'restrictions/DEFAULT_RESTRICTION';
export const setDefaultRestriction = restriction => ({
  type: DEFAULT_RESTRICTION,
  restriction,
});

export const DAILY_RESTRICTION = 'restrictions/DAILY_RESTRICTION';
export const setDailyRestriction = restriction => ({
  type: DAILY_RESTRICTION,
  restriction,
});

export const MODIFY_DAILY_RESTRICTION = 'restrictions/MODIFY_DAILY_RESTRICTION';
export const dailyRestrictionModified = isModified => ({
  type: MODIFY_DAILY_RESTRICTION,
  isModified,
});

export const MODIFY_DEFAULT_RESTRICTION =
  'restrictions/MODIFY_DEFAULT_RESTRICTION';
export const defaultRestrictionModified = isModified => ({
  type: MODIFY_DEFAULT_RESTRICTION,
  isModified,
});

export const MODIFY_INDIVIDUAL_RESTRICTION =
  'restrictions/MODIFY_INDIVIDUAL_RESTRICTION';
export const modifyIndividualRestriction = individualRestriction => ({
  type: MODIFY_INDIVIDUAL_RESTRICTION,
  individualRestriction,
});

export const MODIFIED_INDIVIDUAL_RESTRICTION =
  'restrictions/MODIFIED_INDIVIDUAL_RESTRICTION';
export const modifiedIndividualRestriction = individualRestriction => ({
  type: MODIFIED_INDIVIDUAL_RESTRICTION,
  individualRestriction,
});

export const ADD_INDIVIDUAL_RESTRICTION =
  'restrictions/ADD_INDIVIDUAL_RESTRICTION';
export const addIndividualRestrictionToRestrictions = individualRestriction => ({
  type: ADD_INDIVIDUAL_RESTRICTION,
  individualRestriction,
});

export const ADD_INDIVIDUAL_RESTRICTION_MULTI =
  'restrictions/ADD_INDIVIDUAL_RESTRICTION_MULTI';
export const addIndividualRestrictions = individualRestrictions => ({
  type: ADD_INDIVIDUAL_RESTRICTION_MULTI,
  individualRestrictions,
});

export const LOAD_INDIVIDUAL_RESTRICTIONS =
  'restrictions/LOAD_INDIVIDUAL_RESTRICTIONS';
export const loadIndividualRestrictions = individualRestrictions => ({
  type: LOAD_INDIVIDUAL_RESTRICTIONS,
  individualRestrictions,
});

export const RESET_UPLOADED = 'compliance/RESET_UPLOADED';
export const resetUploaded = () => ({ type: RESET_UPLOADED });

export const UPLOAD_START = 'restrictions/UPLOAD_START';
export const UPLOAD_ONLOAD = 'restrictions/UPLOAD_ONLOAD';
export const UPLOADED = 'restrictions/UPLOADED';

const formatRestriction = restriction => {
  restriction.allowedTokens = web3.utils.fromWei(restriction.allowedTokens);
  restriction.startTime = moment.unix(restriction.startTime / 1000);
  restriction.endTime = moment.unix(restriction.endTime / 1000);
};

export const addVolumeRestrictionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
  let moduleMetadata = {};

  if (volumeRestrictionModule)
    moduleMetadata = await st.getModule(volumeRestrictionModule.address);
  let defaultRestriction;
  let defaultDailyRestriction;
  let isArchived;
  dispatch(
    ui.tx(
      ['Enabling Volume Restriction Transfer Manager'],
      async () => {
        if (moduleMetadata.isArchived) {
          isArchived = true;
          await st.unarchiveModule(volumeRestrictionModule.address);
          defaultRestriction = await volumeRestrictionModule.getDefaultRestriction();
          defaultDailyRestriction = await volumeRestrictionModule.getDefaultDailyRestriction();
        } else {
          await st.setVolumeRestrictionTransferManager();
        }
      },
      'Volume Restriction Transfer Manager Enabled',
      () => {
        dispatch(toggleRestrictions(true));
        if (isArchived) {
          formatRestriction(defaultRestriction);
          formatRestriction(defaultDailyRestriction);
          if (defaultRestriction.rollingPeriodInDays != 0) {
            dispatch(setDefaultRestriction(defaultRestriction));
            dispatch(defaultRestrictionModified(true));
          }
          if (defaultDailyRestriction.rollingPeriodInDays != 0) {
            dispatch(setDailyRestriction(defaultDailyRestriction));
            dispatch(dailyRestrictionModified(true));
          }
        }
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const getVolumeRestrictionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
  if (!volumeRestrictionModule) {
    return;
  }
  const moduleMetadata = await st.getModule(volumeRestrictionModule.address);
  if (volumeRestrictionModule && !moduleMetadata.isArchived) {
    dispatch(toggleRestrictions(true));
    const defaultRestriction = await volumeRestrictionModule.getDefaultRestriction();
    const defaultDailyRestriction = await volumeRestrictionModule.getDefaultDailyRestriction();
    formatRestriction(defaultRestriction);
    formatRestriction(defaultDailyRestriction);
    if (defaultRestriction.rollingPeriodInDays != 0) {
      dispatch(setDefaultRestriction(defaultRestriction));
      dispatch(defaultRestrictionModified(true));
    }
    if (defaultDailyRestriction.rollingPeriodInDays != 0) {
      dispatch(setDailyRestriction(defaultDailyRestriction));
      dispatch(dailyRestrictionModified(true));
    }
    const individualRestrictions = await volumeRestrictionModule.getIndividualRestrictions();
    if (individualRestrictions.length !== 0) {
      dispatch(loadIndividualRestrictions(individualRestrictions));
    }
  }
};

export const archiveVolumeRestrictionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Disabling Volume Restriction Transfer Manager'],
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await st.archiveModule(volumeRestrictionModule.address);
      },
      'Volume Restriction Transfer Manager Disabled',
      () => {
        dispatch(toggleRestrictions(false));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const addDefaultDailyRestriction = (
  allowedTokens,
  startTime,
  endTime,
  restrictionType
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Proceeding with 24h Trade Volume Restriction'],
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.addDefaultDailyRestriction(
          allowedTokens,
          startTime,
          endTime,
          restrictionType
        );
      },
      'Configuring 24h Global Volume Restriction',
      () => {
        const defaultDailyRestriction = {
          allowedTokens,
          startTime,
          rollingPeriodInDays: '1',
          endTime,
          restrictionType,
        };
        formatRestriction(defaultDailyRestriction);
        dispatch(setDailyRestriction(defaultDailyRestriction));
        dispatch(dailyRestrictionModified(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const modifyDefaultDailyRestriction = (
  allowedTokens,
  startTime,
  endTime,
  restrictionType
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Proceeding with 24h Trade Volume Restriction'],
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.modifyDefaultDailyRestriction(
          allowedTokens,
          startTime,
          endTime,
          restrictionType
        );
      },
      'Configuring 24h Global Volume Restriction',
      () => {
        const defaultDailyRestriction = {
          allowedTokens,
          startTime,
          rollingPeriodInDays: '1',
          endTime,
          restrictionType,
        };
        formatRestriction(defaultDailyRestriction);
        dispatch(setDailyRestriction(defaultDailyRestriction));
        dispatch(dailyRestrictionModified(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const addDefaultRestriction = (
  allowedTokens,
  startTime,
  rollingPeriodInDays,
  endTime,
  restrictionType
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Proceed with Custom Trade Volume Restriction'],
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.addDefaultRestriction(
          allowedTokens,
          startTime,
          rollingPeriodInDays,
          endTime,
          restrictionType
        );
      },
      'Custom Trade Volume Restriction Was Successfully Configured',
      () => {
        const defaultRestriction = {
          allowedTokens,
          startTime,
          rollingPeriodInDays,
          endTime,
          restrictionType,
        };
        formatRestriction(defaultRestriction);
        dispatch(setDefaultRestriction(defaultRestriction));
        dispatch(defaultRestrictionModified(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const modifyDefaultRestriction = (
  allowedTokens,
  startTime,
  rollingPeriodInDays,
  endTime,
  restrictionType
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  dispatch(
    ui.tx(
      ['Modify Custom Trade Volume Restriction'],
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.modifyDefaultRestriction(
          allowedTokens,
          startTime,
          rollingPeriodInDays,
          endTime,
          restrictionType
        );
      },
      'Custom Trade Volume Restriction Was Successfully Configured',
      () => {
        const defaultRestriction = {
          allowedTokens,
          startTime,
          rollingPeriodInDays,
          endTime,
          restrictionType,
        };
        formatRestriction(defaultRestriction);
        dispatch(setDefaultRestriction(defaultRestriction));
        dispatch(defaultRestrictionModified(true));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const addIndividualRestriction = (
  dailyRestriction,
  customRestriction
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  const title = [];
  const isDailyRestriction =
    Object.entries(dailyRestriction).length !== 0 &&
    dailyRestriction.constructor === Object;
  const isCustomRestriction =
    Object.entries(customRestriction).length !== 0 &&
    customRestriction.constructor === Object;
  if (isDailyRestriction) {
    title.push('Adding 24H Restriction to Wallet');
  }
  if (isCustomRestriction) {
    title.push('Adding Custom Restriction to Wallet');
  }
  dispatch(
    ui.tx(
      title,
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        if (isDailyRestriction) {
          await volumeRestrictionModule.addIndividualDailyRestriction(
            dailyRestriction.address,
            dailyRestriction.allowedTokens,
            dailyRestriction.startTime,
            dailyRestriction.endTime,
            dailyRestriction.restrictionType
          );
        }

        if (isCustomRestriction) {
          await volumeRestrictionModule.addIndividualRestriction(
            customRestriction.address,
            customRestriction.allowedTokens,
            customRestriction.startTime,
            customRestriction.rollingPeriodInDays,
            customRestriction.endTime,
            customRestriction.restrictionType
          );
        }
      },
      'Trade Volume Restriction Was Successfully Configured for Address',
      () => {
        const newRestriction = {
          id: isCustomRestriction
            ? customRestriction.address
            : dailyRestriction.address,
          address: isCustomRestriction
            ? customRestriction.address
            : dailyRestriction.address,
          dailyStartTime: dailyRestriction.startTime,
          dailyEndTime: dailyRestriction.endTime,
          dailyRestrictionType: dailyRestriction.restrictionType,
          dailyAllowedTokens: isDailyRestriction
            ? web3.utils.fromWei(dailyRestriction.allowedTokens)
            : undefined,
          customStartTime: customRestriction.startTime,
          customEndTime: customRestriction.endTime,
          rollingPeriodInDays: customRestriction.rollingPeriodInDays,
          customRestrictionType: customRestriction.restrictionType,
          customAllowedTokens: isCustomRestriction
            ? web3.utils.fromWei(customRestriction.allowedTokens)
            : undefined,
        };
        dispatch(addIndividualRestrictionToRestrictions(newRestriction));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const individualRestrictionModified = (
  dailyRestriction,
  customRestriction
) => async (dispatch: Function, getState: GetState) => {
  const st: SecurityToken = getState().token.token.contract;
  const title = [];
  const isDailyRestriction =
    Object.entries(dailyRestriction).length !== 0 &&
    dailyRestriction.constructor === Object;
  const isCustomRestriction =
    Object.entries(customRestriction).length !== 0 &&
    customRestriction.constructor === Object;
  if (isDailyRestriction) {
    title.push('Modifying 24H Restriction to Wallet');
  }
  if (isCustomRestriction) {
    title.push('Modifying Custom Restriction to Wallet');
  }
  dispatch(
    ui.tx(
      title,
      async () => {
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        if (isDailyRestriction) {
          await volumeRestrictionModule.modifyIndividualDailyRestriction(
            dailyRestriction.address,
            dailyRestriction.allowedTokens,
            dailyRestriction.startTime,
            dailyRestriction.endTime,
            dailyRestriction.restrictionType
          );
        }

        if (isCustomRestriction) {
          await volumeRestrictionModule.modifyIndividualRestriction(
            customRestriction.address,
            customRestriction.allowedTokens,
            customRestriction.startTime,
            customRestriction.rollingPeriodInDays,
            customRestriction.endTime,
            customRestriction.restrictionType
          );
        }
      },
      'Trade Volume Restriction Was Successfully Configured for Address',
      () => {
        const newRestriction = {
          id: isCustomRestriction
            ? customRestriction.address
            : dailyRestriction.address,
          address: isCustomRestriction
            ? customRestriction.address
            : dailyRestriction.address,
          dailyStartTime: dailyRestriction.startTime,
          dailyEndTime: dailyRestriction.endTime,
          dailyRestrictionType: dailyRestriction.restrictionType,
          dailyAllowedTokens: isDailyRestriction
            ? web3.utils.fromWei(dailyRestriction.allowedTokens)
            : undefined,
          customStartTime: customRestriction.startTime,
          customEndTime: customRestriction.endTime,
          rollingPeriodInDays: customRestriction.rollingPeriodInDays,
          customRestrictionType: customRestriction.restrictionType,
          customAllowedTokens: isCustomRestriction
            ? web3.utils.fromWei(customRestriction.allowedTokens)
            : undefined,
        };
        dispatch(modifiedIndividualRestriction(newRestriction));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const removeDefaultRestriction = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.tx(
      ['Removing Custom Trade Volume Restriction'],
      async () => {
        const st: SecurityToken = getState().token.token.contract;
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.removeDefaultRestriction();
      },
      'Custom Trade Volume Restriction Removed',
      () => {
        dispatch(setDefaultRestriction(null));
        dispatch(defaultRestrictionModified(false));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const removeDefaultDailyRestriction = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.tx(
      ['Removing 24H Trade Volume Restriction'],
      async () => {
        const st: SecurityToken = getState().token.token.contract;
        const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
        await volumeRestrictionModule.removeDefaultDailyRestriction();
      },
      '24H Trade Volume Restriction Removed',
      () => {
        dispatch(setDailyRestriction(null));
        dispatch(dailyRestrictionModified(false));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};

export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const maxRows = 75;
  const reader = new FileReader();

  dispatch({ type: UPLOAD_START });

  reader.readAsText(file);

  reader.onload = () => {
    dispatch({ type: UPLOAD_ONLOAD });
    const { invalidRows, data, parseError } = parseWhitelistCsv(reader.result);
    console.log(data);
    const isTooMany = data.length > maxRows;

    // FIXME @RafaelVidaurre: This should be using an action creator, not a POJO
    dispatch({
      type: UPLOADED,
      investors: data,
      criticals: invalidRows,
      isTooMany,
      parseError: parseError | '',
    });
  };
};

export const addIndividualRestrictionMulti = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const uploadedRestrictions = getState().restrictions.investors;
  const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
  let dailyRestrictions = [];
  let customRestrictions = [];
  let titles = [];

  for (var i = 0; i < 5; i++) {
    dailyRestrictions[i] = [];
  }

  for (var i = 0; i < 6; i++) {
    customRestrictions[i] = [];
  }

  uploadedRestrictions.forEach(restriction => {
    if (
      typeof restriction.dailyStartTime !== 'undefined' &&
      typeof restriction.dailyEndTime !== 'undefined' &&
      typeof restriction.dailyAllowedTokens !== 'undefined' &&
      typeof restriction.dailyRestrictionType !== 'undefined'
    ) {
      dailyRestrictions[0].push(restriction.address);
      dailyRestrictions[1].push(
        web3.utils.toWei(restriction.dailyAllowedTokens)
      );
      dailyRestrictions[2].push(restriction.dailyStartTime);
      dailyRestrictions[3].push(restriction.dailyEndTime);
      dailyRestrictions[4].push(restriction.dailyRestrictionType);
    }

    if (
      typeof restriction.customStartTime !== 'undefined' &&
      typeof restriction.customEndTime !== 'undefined' &&
      typeof restriction.customAllowedTokens !== 'undefined' &&
      typeof restriction.customRestrictionType !== 'undefined' &&
      typeof restriction.rollingPeriodInDays !== 'undefined'
    ) {
      customRestrictions[0].push(restriction.address);
      customRestrictions[1].push(
        web3.utils.toWei(restriction.customAllowedTokens)
      );
      customRestrictions[2].push(restriction.customStartTime);
      customRestrictions[3].push(restriction.rollingPeriodInDays);
      customRestrictions[4].push(restriction.customEndTime);
      customRestrictions[5].push(restriction.customRestrictionType);
    }
  });

  if (dailyRestrictions[0].length > 0)
    titles.push('Adding 24H Trade Volume Restrictions for Addresses');
  if (customRestrictions[0].length > 0)
    titles.push('Adding Custom Trade Volume Restrictions for Addresses');

  dispatch(
    ui.tx(
      titles,
      async () => {
        if (dailyRestrictions[0].length > 0) {
          await volumeRestrictionModule.addIndividualDailyRestrictionMulti(
            dailyRestrictions[0],
            dailyRestrictions[1],
            dailyRestrictions[2],
            dailyRestrictions[3],
            dailyRestrictions[4]
          );
        }
        if (customRestrictions[0].length > 0) {
          await volumeRestrictionModule.addIndividualRestrictionMulti(
            customRestrictions[0],
            customRestrictions[1],
            customRestrictions[2],
            customRestrictions[3],
            customRestrictions[4],
            customRestrictions[5]
          );
        }
      },
      'Trade Volume Restrictions Configured for Addresses',
      () => {
        dispatch(addIndividualRestrictions(uploadedRestrictions));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};
