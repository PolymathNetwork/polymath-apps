import React, { Component } from 'react';
import { RouteComponentProps, navigate, Redirect } from '@reach/router';

interface Props extends RouteComponentProps {
  to: string;
}

export class RedirectionPage extends Component<Props> {
  public static defaultProps = {
    to: '/',
  };
  public render() {
    const { to } = this.props;
    return <Redirect to={to} noThrow />;
  }
}
