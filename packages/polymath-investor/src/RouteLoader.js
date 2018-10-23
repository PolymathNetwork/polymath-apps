// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Loading } from 'carbon-components-react';
import { MetamaskStatus } from '@polymathnetwork/ui';
import {
  KOVAN_NETWORK_ID,
  MAINNET_NETWORK_ID,
} from '@polymathnetwork/shared/constants';
import EthNetworkWrapper from '@polymathnetwork/ui/components/EthNetworkWrapper';

import routes from './routes';

type Props = {
  location: {
    pathname: string,
    [any]: any,
  },
};

class RouteLoader extends Component<Props> {
  render() {
    const networks = [MAINNET_NETWORK_ID, KOVAN_NETWORK_ID];
    return (
      <EthNetworkWrapper
        loading={<Loading />}
        guide={<MetamaskStatus networks="Mainnet or Kovan" />}
        networks={networks}
      >
        {renderRoutes(routes)}
      </EthNetworkWrapper>
    );
  }
}

export default withRouter(RouteLoader);
