import React, { ReactNode, Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';

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
    console.log(hasRendered);
    console.log(changingRoute);

    if (!hasRendered && changingRoute) {
      console.log('LOADING???');
      return <Loading />;
    }
    console.log('NOT LOADING');
    return this.props.render();
  }
}

const mapStateToProps = ({ app }: RootState) => ({
  changingRoute: app.changingRoute,
});

export const PageLoader = connect(mapStateToProps)(PageLoaderBase);
