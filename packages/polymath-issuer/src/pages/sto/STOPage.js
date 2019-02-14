// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import type { SecurityToken } from '@polymathnetwork/js/types';
import { NotFoundPage } from '@polymathnetwork/ui';

import { fetch } from '../../actions/sto';
import {
  STAGE_SELECT,
  STAGE_CONFIGURE,
  STAGE_OVERVIEW,
  STAGE_COMPLETED,
} from '../../reducers/sto';
import SelectSTOTemplate from './components/SelectSTOTemplate';
import STOOverview from './components/STOOverview';
import ConfigureSTO from './components/ConfigureSTO';
import type { RootState } from '../../redux/reducer';

import './style.scss';

type StateProps = {|
  token: ?SecurityToken,
  stage: number,
|};

type DispatchProps = {|
  fetch: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  stage: state.sto.stage,
});

const mapDispatchToProps: DispatchProps = {
  fetch,
};

type Props = StateProps & DispatchProps;

class STOPage extends Component<Props> {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { token } = this.props;
    if (!token || !token.address) {
      return <NotFoundPage />;
    }
    switch (this.props.stage) {
      case STAGE_SELECT:
        return <SelectSTOTemplate />;
      case STAGE_CONFIGURE:
        return <ConfigureSTO />;
      case STAGE_OVERVIEW:
      case STAGE_COMPLETED:
        return <STOOverview />;
      default:
        return <Loading />;
    }
  }
}

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(STOPage)
);
