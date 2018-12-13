import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';

/**
 * Starting page for users who haven't logged in yet
 */
export class HomePage extends Component<RouteComponentProps> {
  public render() {
    return (
      <div data-testid="HomePage">
        <h1>Home page</h1>
      </div>
    );
  }
}
