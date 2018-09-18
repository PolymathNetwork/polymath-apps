// @flow
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Loading } from 'carbon-components-react'
import PolymathAuth, { NETWORK_MAIN, NETWORK_KOVAN } from 'polymath-auth'
import { MetamaskPage } from 'polymath-ui'

import routes from './routes'

type Props = {
  location: {
    pathname: string,
    [any]: any
  }
}

class RouteLoader extends Component<Props> {
  render () {
    const networks = [
      NETWORK_MAIN,
      NETWORK_KOVAN,
    ]
    return (
      <PolymathAuth loading={<Loading />} guide={<MetamaskPage networks='Mainnet or Kovan' />} networks={networks}>
        {renderRoutes(routes)}
      </PolymathAuth>
    )
  }
}

export default withRouter(RouteLoader)
