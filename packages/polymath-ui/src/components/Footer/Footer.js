import React, { Component } from 'react';

import './style.scss';

type Props = {|
  title?: string,
  termsOfService?: string,
  privacyPolicy?: string,
|};

export default class Footer extends Component<Props> {
  render() {
    return (
      <div className="pui-footer">
        <p className="pui-footer-text">
          &copy; {new Date().getFullYear()} {this.props.title || 'Polymath'}
        </p>
        <ul className="pui-footer-links">
          <li>
            <a
              href={
                this.props.termsOfService ||
                'https://polymath.network/termsofservice.html'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms Of Service
            </a>
          </li>
          <li>
            <a
              href={
                this.props.privacyPolicy ||
                'https://polymath.network/privacypolicy.html'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
