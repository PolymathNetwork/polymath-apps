import React, { Component } from 'react';

import * as sc from './styles';
import { PageWrapProps } from '../PageWrap';

export interface PageProps extends PageWrapProps {
  title?: string;
  children: React.ReactNode;
}

const appTitle = 'Polymath';

export class Page extends Component<PageProps> {
  public componentWillMount() {
    this.update(this.props);
  }

  public componentDidUpdate() {
    this.update(this.props);
  }

  public update(props: PageProps) {
    document.title = props.title ? `${props.title} | ${appTitle}` : appTitle;
  }

  public render() {
    const { children, title, ...props } = this.props;
    return (
      <sc.Wrapper py="xl" {...props}>
        {children}
      </sc.Wrapper>
    );
  }
}
