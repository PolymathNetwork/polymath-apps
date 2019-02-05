import React from 'react';
import * as Sentry from '@sentry/browser';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: { [key: string]: any }) {
    // Display fallback UI
    this.setState({ hasError: true });

    // From https://sentry.io/onboarding/polymath-y0/issuer/configure/javascript-react
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Aw, Snap!</h1>
        </div>
      );
    }
    return this.props.children;
  }
}
