// @flow

import * as React from 'react';

type Props = {
  children: Array<React.Element<any>> | React.Element<any>,
};

type State = {
  hasError: boolean,
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: string) {
    // Display fallback UI
    this.setState({ hasError: true });
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
