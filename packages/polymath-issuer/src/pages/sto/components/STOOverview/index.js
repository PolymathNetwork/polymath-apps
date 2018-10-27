// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as views from './views';

import type { STOModuleType } from '../../../../constants';

type ContainerProps = {|
  type: STOModuleType,
|};
// - Get sto data
// - Conditionally render the views
const mapStateToProps = ({ sto }) => {
  return {
    type: sto.details.type,
  };
};

class STOOverviewContainer extends Component<ContainerProps> {
  render() {
    const { type } = this.props;
    const ViewComponent = views[type];
    if (!ViewComponent) {
      throw new Error(`No component exists for sto type "${type}"`);
    }
    return <ViewComponent />;
  }
}

export default connect(mapStateToProps)(STOOverviewContainer);
