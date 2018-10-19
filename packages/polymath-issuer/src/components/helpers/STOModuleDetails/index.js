import React, { Component, Node } from 'react';

type RenderProps = {||};
type Props = {|
  type: string,
  render: () => Node,
|};

export default class STOModuleDetails extends Component<Props> {
  render() {
    return this.props.render();
  }
}
