import React, { Component } from 'react';

interface Props {
  onLogin: () => any;
}

/**
 * Starting page for users who haven't logged in yet
 */
export class Presenter extends Component<Props> {
  public handleLogin = () => {
    this.props.onLogin();
  };

  public render() {
    return (
      <div>
        [LoginPage]<button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}
