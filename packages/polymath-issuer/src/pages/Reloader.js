import { Loading } from '@polymathnetwork/new-ui';
import React, { Component } from 'react';

export default class Reloader extends Component {
  componentDidMount() {
    window.location.reload();
  }
  render() {
    return <Loading />;
  }
}
