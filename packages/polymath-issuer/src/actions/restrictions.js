import * as ui from '@polymathnetwork/ui';

export const TOGGLE_RESTRICTIONS = 'restrictions/TOGGLE_RESTRICTIONS';
export const toggleRestrictions = isToggled => ({
  type: TOGGLE_RESTRICTIONS,
  isToggled,
});

export const addVolumeRestrictionModule = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
  let moduleMetadata = {};
  if (volumeRestrictionModule)
    moduleMetadata = await st.getModule(volumeRestrictionModule.address);
  dispatch(
    ui.tx(
      ['Enabling Volume Restriction Transfer Manager'],
      async () => {
        if (moduleMetadata.isArchived) {
          await st.unarchiveModule(volumeRestrictionModule.address);
        } else {
          await st.setVolumeRestrictionTransferManager();
        }
      },
      'Volume Restriction Transfer Manager Enabled',
      () => {
        dispatch(toggleRestrictions(true));
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
  if (volumeRestrictionModule) {
    dispatch(toggleRestrictions(true));
    const defaultRestriction = await volumeRestrictionModule.getDefaultRestriction();
    // const defaultRestriction = await volumeRestrictionModule.getDefaultRestriction();
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

export const addDefaultDailyRestriction = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const st: SecurityToken = getState().token.token.contract;
  const volumeRestrictionModule = await st.getVolumeRestrictionTransferManager();
  dispatch(
    ui.tx(
      ['Proceeding with 24h Trade Volume Restriction'],
      async () => {},
      'Configuring 24h Global Volume Restriction',
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
        // dispatch(toggleRestrictions(false));
      },
      undefined,
      undefined,
      undefined,
      true
    )
  );
};
