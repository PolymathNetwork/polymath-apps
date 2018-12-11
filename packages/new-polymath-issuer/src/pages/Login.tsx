import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';

/**
 * Starting page for users who haven't logged in yet
 */
export class LoginPage extends Component<RouteComponentProps> {
  public render() {
    return (
      <div data-testid="LoginPage">
        <h1>Login page</h1>
      </div>
    );
  }
}
