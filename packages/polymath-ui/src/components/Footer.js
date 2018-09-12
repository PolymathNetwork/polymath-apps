import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
            <Link
              to={
                this.props.termsOfService ||
                'https://polymath.network/termsofservice.html'
              }
              target="_blank"
            >
              Terms Of Service
            </Link>
          </li>
          <li>
            <Link
              to={
                this.props.privacyPolicy ||
                'https://polymath.network/privacypolicy.html'
              }
              target="_blank"
            >
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
