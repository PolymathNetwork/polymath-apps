import React, { Component, FC, Fragment } from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { client } from '~/lib/polymathClient';
import { NotFoundPage } from '~/pages';

// TODO @RafaelVidaurre: Delete this temp component
class InitializeTemp extends Component<RouteComponentProps> {
  public state = {
    loading: true,
  };

  public async componentDidMount() {
    await client.connect();

    this.setState({ loading: false });
  }

  public render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return <Fragment>{this.props.children}</Fragment>;
  }
}

export const Routes = () => (
  <Router>
    <InitializeTemp path="/">
      <NotFoundPage default />
    </InitializeTemp>
  </Router>
);
