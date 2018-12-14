import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loginStart } from '~/state/actions/session';
import { Presenter } from './Presenter';

export interface Props {
  dispatch: Dispatch<any>;
}

export class ContainerBase extends Component<Props> {
  public login = () => {
    this.props.dispatch(loginStart());
  };

  public render() {
    return <Presenter onLogin={this.login} />;
  }
}

export const Container = connect()(ContainerBase);
