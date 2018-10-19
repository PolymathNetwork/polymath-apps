import React, { Component, Node } from 'react';
import { ModuleRegistry } from '@polymathnetwork/js';

type RenderProps = {|
  loading: boolean,
|};
type Props = {|
  type: string,
  render: RenderProps => Node,
|};

export default class STOModuleDetails extends Component<Props> {
  state = {
    loading: true,
  };
  componentDidMount() {}
  render() {
    const { loading } = this.state;
    const renderProps = {
      loading,
    };
    return this.props.render();
  }
}
