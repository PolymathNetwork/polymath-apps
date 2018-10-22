// @flow

import { Component } from 'react';
import type { Node } from 'react';

type Props = {|
  render: () => Node,
|};

export class WithSTOModules extends Component<Props> {
  render() {
    return this.props.render();
  }
}
