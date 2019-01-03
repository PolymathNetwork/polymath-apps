import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
}

export class ContainerBase extends Component<Props> {
  public componentDidMount() {
    const { dispatch, symbol } = this.props;
  }
  public render() {
    return <Presenter />;
  }
}

export const Container = connect()(ContainerBase);
