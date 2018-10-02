// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import type { Node } from 'react';

// TODO @bshevchenko: why Flow cannot resolve @polymathnetwork/ui/style.css?
// $FlowFixMe
import '@polymathnetwork/ui/style.scss';
import '../style.scss';

type StateProps = {|
  isNotice: boolean,
|};

const mapStateToProps = (state): StateProps => ({
  isNotice: state.pui.notice.isOpen,
});

type Props = {|
  route?: Object,
  children: ?Node,
|} & StateProps;

class Root extends Component<Props> {
  render() {
    const { children, route, isNotice } = this.props;
    return (
      <div className={'bx--grid' + (isNotice ? ' pui-grid-notice' : '')}>
        {children || (route ? renderRoutes(route.routes) : null)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Root);
