import React, { Component } from 'react';

import * as sc from './styles';
import { PageWrapProps } from '../PageWrap';

export interface PageProps extends PageWrapProps {
  title?: string;
  children: React.ReactNode;
}

const appTitle = 'Polymath';

export class Page extends Component<PageProps> {
  componentWillMount() {
    this.update(this.props);
  }

  componentDidUpdate() {
    this.update(this.props);
  }

  update(props: PageProps) {
    document.title = props.title ? `${props.title} | ${appTitle}` : appTitle;
  }

  render() {
    const { children, title, ...props } = this.props;
    return (
      <sc.Wrapper py="xl" {...props}>
        {children}
      </sc.Wrapper>
    );
  }
}
