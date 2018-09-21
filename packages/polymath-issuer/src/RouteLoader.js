// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Loading } from 'carbon-components-react';
import PolymathAuth, {
  NETWORK_MAIN,
  NETWORK_KOVAN,
} from '@polymathnetwork/auth';
import { MetamaskPage, DummyPage } from '@polymathnetwork/ui';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';

import Root from './app/Root';
import SplashPage from './app/SplashPage';
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
          <DummyPage />
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
        guide={<MetamaskPage networks="Mainnet or Kovan" />}
        networks={networks}
      >
        {renderRoutes(routes)}
      </PolymathAuth>
    );
  }
}

export default withRouter(RouteLoader);
