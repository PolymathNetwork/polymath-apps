import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RootState } from '~/state/store';

export { HomePage } from './Home';
export { LoginPage } from './Login';
export { MetamaskGetPage } from './MetamaskGetPage';
export { MetamaskLockedPage } from './MetamaskLockedPage';
export { SecurityTokensIndexPage } from './SecurityTokensIndex';
export { SecurityTokensReservePage } from './SecurityTokensReserve';
export { SecurityTokensDividendsPage } from './SecurityTokensDividends';

interface Props {
  router: RootState['router'];
}

export const PagesBase: FC<Props> = ({ router }) => {
  const PageToRender = (router.result as any).Page;

  return <PageToRender />;
};

const mapStateToProps = ({ router }: RootState) => ({ router });

export const Pages = connect(mapStateToProps)(PagesBase);
