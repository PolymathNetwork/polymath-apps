// @flow

import React, { Component } from 'react';

import STOTemplateComponent from './Component';
import type { STOModule } from '../../../../constants';

type Props = {|
  stoModule: STOModule,
|};

export default class STOTemplate extends Component<Props> {
  render() {
    const { stoModule } = this.props;
    return <STOTemplateComponent stoModule={stoModule} />;
  }
}
