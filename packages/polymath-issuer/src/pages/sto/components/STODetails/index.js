import React, { Component } from 'react';
import { Loading } from 'carbon-components-react';

import STOModuleDetails from '../../../../components/helpers/STOModuleDetails';
import STODetailsComponent from './Component';

export default class STODetails extends Component {
  render() {
    return (
      <STOModuleDetails
        render={stoModuleDetails => {
          if (!stoModuleDetails) {
            return <Loading />;
          }

          return <STODetailsComponent details={stoModuleDetails} />;
        }}
      />
    );
  }
}
