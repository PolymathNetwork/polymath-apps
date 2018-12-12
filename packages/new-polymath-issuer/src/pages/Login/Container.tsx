import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { login } from '~/state/actions/session';
import { Presenter } from './Presenter';

export interface Props extends RouteComponentProps {
  dispatch: Dispatch<any>;
}

export class ContainerBase extends Component<Props> {
  public login = () => {
    this.props.dispatch(login());
  };

  public render() {
    return <Presenter onLogin={this.login} />;
  }
}

export const Container = connect()(ContainerBase);
