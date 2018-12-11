import React, { Component } from 'react';
import { RouteComponentProps, Redirect, navigate } from '@reach/router';

interface Props extends RouteComponentProps {
  to: string;
}

export class RedirectionPage extends Component<Props> {
  public componentDidMount() {
    navigate(this.props.to);
  }
  public render() {
    return <span data-testid="redirection" />;
  }
}
