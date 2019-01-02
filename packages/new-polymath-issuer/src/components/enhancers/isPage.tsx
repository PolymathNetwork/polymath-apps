import React, { ReactNode, Component } from 'react';
import { render } from 'react-testing-library';
import { connect } from 'react-redux';
import { RootState } from '~/state/store';
import { Loading } from '../__temporary';

interface Props {
  changingRoute: boolean;
  render(): ReactNode;
}
interface State {
  hasRendered: boolean;
}

class PageLoaderBase extends Component<Props, State> {
  public state = {
    hasRendered: false,
  };

  public componentDidUpdate({ changingRoute: previousChangingRoute }: Props) {
    const { changingRoute } = this.props;

    if (!previousChangingRoute !== changingRoute && changingRoute) {
      this.setState({ hasRendered: true });
    }
  }

  public render() {
    const { hasRendered } = this.state;
    const { changingRoute } = this.props;

    if (!hasRendered && changingRoute) {
      return <Loading />;
    }
    return this.props.render();
  }
}

const mapStateToProps = ({ app }: RootState) => ({
  changingRoute: app.changingRoute,
});

export const PageLoader = connect(mapStateToProps)(PageLoaderBase);
