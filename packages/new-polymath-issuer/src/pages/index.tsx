import React, {
  FC,
  Fragment,
  StatelessComponent,
  ComponentClass,
  Component,
} from 'react';
import { connect } from 'react-redux';
import { RootState } from '~/state/store';
import { Location } from 'redux-little-router';
import { DefaultLayout } from '../layouts';
import { PageLoader } from '~/components/enhancers/isPage';

export { HomePage } from './Home';
export { LoginPage } from './Login';
export { MetamaskGetPage } from './MetamaskGet';
export { MetamaskLockedPage } from './MetamaskLocked';
export { SecurityTokensIndexPage } from './SecurityTokensIndex';
export { SecurityTokensReservePage } from './SecurityTokensReserve';
export { SecurityTokensDividendsPage } from './SecurityTokensDividends';
export { DividendsWizardPage } from './DividendsWizard';
export { NotFoundPage } from './NotFound';
export { DividendDetailsPage } from './DividendDetails';

interface StateProps {
  router: RootState['router'];
  changingRoute: boolean;
}
interface Props extends StateProps {}

const EmptyLayout: FC = ({ children }) => <Fragment>{children}</Fragment>;
const EmptyPage: FC = () => null;

/**
 * Searches upward for a layout to use for a given route
 */
function getLayout(
  result: Location['result']
): ComponentClass | StatelessComponent {
  if (result) {
    if (result.Layout) {
      return result.Layout;
    }
    if (result.parent) {
      return getLayout(result.parent);
    }
  }

  return DefaultLayout;
}

/**
 * Renders a Page component depending on the current route
 * and the app's route configuration
 */
export class PagesBase extends Component<Props> {
  public static getDerivedStateFromProps({ router }: Props) {
    const LayoutComponent = getLayout(router.result);
    const PageComponent = (router.result as any).Page;

    return { PageComponent, LayoutComponent };
  }

  public state = {
    PageComponent: EmptyPage,
    LayoutComponent: EmptyLayout,
  };

  public render() {
    const { router } = this.props;
    const LayoutComponent = getLayout(router.result);
    // TODO @monitz87: refine typing for this so that we can know if a page isn't getting
    // all its props from the router
    const PageComponent = (router.result as any).Page || EmptyPage;
    const params = router.params;

    return (
      <PageLoader
        render={() => (
          <LayoutComponent>
            <PageComponent {...params} />
          </LayoutComponent>
        )}
      />
    );
  }
}

const mapStateToProps = ({ router, app }: RootState) => ({
  router,
  changingRoute: app.changingRoute,
});

export const Pages = connect(mapStateToProps)(PagesBase);
