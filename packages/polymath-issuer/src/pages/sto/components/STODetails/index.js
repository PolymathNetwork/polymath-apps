// @flow

import React, { Component } from 'react';
import { Loading } from 'carbon-components-react';

import STOModuleDetails from '../../../../components/composers/STOModuleDetails';
import STODetailsComponent from './Component';

export default class STODetails extends Component<{}> {
  render() {
    // return (
    //   <STOModuleDetails
    //     type="USDTieredSTO"
    //     render={stoModuleDetails => {
    //       if (!stoModuleDetails) {
    //         return <Loading />;
    //       }
    //       return <STODetailsComponent details={stoModuleDetails} />;
    //     }}
    //   />
    // );
    return <div>Pending</div>;
  }
}
