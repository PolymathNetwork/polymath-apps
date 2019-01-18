// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import STOTemplateComponent from './Component';
import { useFactory } from '../../../../actions/sto';

import type { Dispatch } from 'redux';
import type { STOModule } from '../../../../constants';

type Props = {|
  stoModule: STOModule,
  dispatch: Dispatch<any>,
  pickingEnabled?: boolean,
|};

class STOTemplate extends Component<Props> {
  pickSTOTemplate = () => {
    const { dispatch, stoModule } = this.props;

    dispatch(useFactory(stoModule));
  };
  render() {
    console.log(this.props.stoModule);
    const { stoModule, pickingEnabled } = this.props;
    return (
      <STOTemplateComponent
        pickingEnabled={!!pickingEnabled}
        handlePickSTOTemplate={this.pickSTOTemplate}
        stoModule={stoModule}
      />
    );
  }
}

export default connect(null)(STOTemplate);
