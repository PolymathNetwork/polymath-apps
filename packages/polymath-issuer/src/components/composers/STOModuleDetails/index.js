// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { fetch } from '../../../actions/stoModules';

import type { Dispatch } from 'redux';
import type { Node } from 'react';
import type { STOModuleType } from '../../../constants';
import type { RootState } from '../../../redux/reducer';
import type { STOModule } from '../../../reducers/stoModules';

type RenderProps = STOModule | null;

type OwnProps = {|
  type: STOModuleType,
  render: RenderProps => Node,
|};

type StateProps = {
  data: STOModule | null,
  dispatch: Dispatch<any>,
} & OwnProps;

type Props = StateProps;

const mapStateToProps = ({ stoModules }: RootState, { type }: OwnProps) => {
  const stoModule = stoModules[type];

  return {
    data: stoModule,
  };
};

export class STOModuleDetails extends Component<Props> {
  componentDidMount() {
    const { data, type, dispatch } = this.props;
    if (!data) {
      dispatch(fetch({ type })).catch(err => {
        throw err;
      });
    }
  }
  render() {
    const { data } = this.props;
    const renderProps = data || null;

    return <Fragment>{this.props.render(renderProps)}</Fragment>;
  }
}

export default connect(mapStateToProps)(STOModuleDetails);
