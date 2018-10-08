// @flow

import React from 'react';
// import Raven from 'raven-js';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    // Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Silently (visually) fail if an error happen
      return (
        <div>
          <h1>Aw, Snap!</h1>
        </div>
      );
    }
    return this.props.children;
  }
}
