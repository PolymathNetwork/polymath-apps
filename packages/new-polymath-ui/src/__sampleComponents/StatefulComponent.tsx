import React, { Component } from 'react';

interface Props {
  foo: number;
}
interface State {
  bar: number;
}

export class StatefulExample extends Component<Props, State> {
  static defaultState = {
    bar: 10,
  };

  render() {
    const { bar } = this.state;

    return <div>{bar}</div>;
  }
}
