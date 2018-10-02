// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import './style.scss';

type Props = {|
  title: string,
  children: string | Node,
  small?: boolean,
|};

export default class Remark extends Component<Props> {
  render() {
    const { title, children, small } = this.props;
    return (
      <div className={'pui-remark' + (small ? ' pui-remark-small' : '')}>
        <div className="pui-remark-title">{title}</div>
        <div className="pui-remark-text">{children}</div>
      </div>
    );
  }
}
