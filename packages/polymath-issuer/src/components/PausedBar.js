// @flow

import { connect } from 'react-redux';
import { PausedBar, confirm } from '@polymathnetwork/ui';

import { toggleFreeze } from '../actions/compliance';

import type { RootState } from '../redux/reducer';

type StateProps = {|
  isTokenFrozen: boolean,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  // $FlowFixMe
  isTokenFrozen: state.whitelist.freezeStatus,
});

const mapDispatchToProps = {
  confirm,
  toggleFreeze,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PausedBar);
