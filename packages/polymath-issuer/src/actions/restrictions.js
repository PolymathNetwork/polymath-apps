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
  console.log(volumeRestrictionModule);
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
  console.log(volumeRestrictionModule);
  if (volumeRestrictionModule) dispatch(toggleRestrictions(true));
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
