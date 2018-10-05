// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Loading } from 'carbon-components-react';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';
import { hot } from 'react-hot-loader';
import PolymathAuth, {
  NETWORK_MAIN,
  NETWORK_KOVAN,
} from '@polymathnetwork/ui/components/EthNetworkWrapper';
import { MetamaskStatus, NotSupportedPage } from '@polymathnetwork/ui';

import Root from './components/Root';
import SplashPage from './components/SplashPage';
import routes from './routes';

type Props = {
  location: {
    pathname: string,
    [any]: any,
  },
};

class RouteLoader extends Component<Props> {
  render() {
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera
    if (isMobile || isUnsupportedBrowser) {
      return (
        <Root>
          <NotSupportedPage />
        </Root>
      );
    } else if (this.props.location.pathname === '/') {
      // noinspection RequiredAttributes
      return (
        <Root>
          <SplashPage />
        </Root>
      );
    }
    const networks = [NETWORK_MAIN, NETWORK_KOVAN];
    return (
      <PolymathAuth
        loading={<Loading />}
        guide={<MetamaskStatus networks="Mainnet or Kovan" />}
        networks={networks}
      >
        {renderRoutes(routes)}
      </PolymathAuth>
    );
  }
}

export default hot(module)(withRouter(RouteLoader));
