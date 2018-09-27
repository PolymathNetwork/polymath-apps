// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { Node } from 'react';

type MenuItem = {|
  title: string,
  icon: Node,
  to: string,
  isActive: boolean,
  isDisabled: boolean,
|};

type Props = {|
  topItems: Array<MenuItem>,
  bottomItems: Array<MenuItem>,
|};

export default class Sidebar extends Component<Props> {
  // noinspection JSMethodCanBeStatic
  items(items: Array<MenuItem>) {
    return (
      <ul>
        {items.map(
          (item: MenuItem) =>
            item.isDisabled ? (
              <li key={item.to} className="disabled">
                {item.icon}
                <p>{item.title}</p>
              </li>
            ) : (
              <Link key={item.to} to={item.to}>
                <li className={item.isActive ? 'active' : ''}>
                  {item.icon}
                  <p>{item.title}</p>
                </li>
              </Link>
            )
        )}
      </ul>
    );
  }

  render() {
    const { topItems, bottomItems } = this.props;
    return (
      <div className="pui-sidebar">
        {this.items(topItems)}
        {this.items(bottomItems)}
      </div>
    );
  }
}
