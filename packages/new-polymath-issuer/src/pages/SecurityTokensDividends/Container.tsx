import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';

export interface Props extends RouteComponentProps {
  dispatch: Dispatch<any>;
}

export class ContainerBase extends Component<Props> {
  public render() {
    return <Presenter />;
  }
}

export const Container = connect()(ContainerBase);
