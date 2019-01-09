import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loginStart } from '~/state/actions/session';
import { Presenter } from './Presenter';
import { ActionType } from 'typesafe-actions';

export interface Props {
  dispatch: Dispatch<ActionType<typeof loginStart>>;
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
