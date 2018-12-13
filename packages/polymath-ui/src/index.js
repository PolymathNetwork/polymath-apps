// @flow

/**
 * Theme styles
 */
export { default as theme } from './styles/theme';
export { default as GlobalStyles } from './styles/GlobalStyles';

/**
 * Components
 */
export * from './components/inputs';

export { default as Box } from './components/Box';
export { default as Grid } from './components/Grid';
export { default as InlineFlex } from './components/InlineFlex';
export { default as Flex } from './components/Flex';
export { default as Icon } from './components/Icon';
export { default as IconButton } from './components/IconButton';
export { default as IconText } from './components/IconText';
export { default as PageWrap } from './components/PageWrap';
export { default as Heading } from './components/Heading';
export { default as Paragraph } from './components/Paragraph';
export { default as ContentBox } from './components/ContentBox';
export { default as FormItem } from './components/FormItem';
export { default as FormItemGroup } from './components/FormItemGroup';
export { default as LabeledItem } from './components/LabeledItem';
export { default as Button } from './components/Button';
export { default as Page } from './components/Page';
export { default as PageCentered } from './components/PageCentered';
export { default as Modal } from './components/Modal';
export { default as ActionModal } from './components/ActionModal';
export { default as TxModal } from './components/TxModal';
export { default as ConfirmModal } from './components/ConfirmModal';
export { default as EnterPINModal } from './components/EnterPINModal';
export { default as STOStatus } from './components/STOStatus';
export { default as Countdown } from './components/Countdown';
export { default as Remark } from './components/Remark';
export { default as Toaster } from './components/Toaster';
export { default as Sidebar } from './components/Sidebar';
export { default as PausedBar } from './components/PausedBar';
export * from './components/EthNetworkWrapper';
export { default as EthNetworkWrapper } from './components/EthNetworkWrapper';
export { default as NoticeBar } from './components/NoticeBar';
export { default as Header } from './components/Header';
export { default as Footer } from './components/Footer';
export { default as MetamaskStatus } from './components/MetamaskStatus';
export { default as NotFoundPage } from './components/NotFoundPage';
export { default as NotSupportedPage } from './components/NotSupportedPage';
export { default as MaintenancePage } from './components/MaintenancePage';
export { default as SignUpPage } from './components/SignUpPage';
export { default as SignUpSuccessPage } from './components/SignUpSuccessPage';
export { default as SignInPage } from './components/SignInPage';
export { default as ErrorBoundary } from './components/ErrorBoundary';
export { default as DynamicTable } from './components/DynamicTable';
export { default as SimpleTable } from './components/SimpleTable';
export { default as RaisedAmount } from './components/RaisedAmount';
export { default as ProgressBar } from './components/ProgressBar';
export { default as TierStatus } from './components/TierStatus';
export { default as StickyTop } from './components/StickyTop';
export { default as Tooltip } from './components/Tooltip';

/**
 * Redux
 */
export { getNotice } from './components/NoticeBar/actions';
export { notify } from './components/Toaster/actions';
export { tx, txEnd, txHash } from './components/TxModal/actions';
export { confirm } from './components/ConfirmModal/actions';

export {
  fetching,
  fetched,
  fetchingFailed,
  setupHistory,
} from './redux/common/actions';
export {
  fetchBalance,
  signIn,
  signUp,
  requestConfirmEmail,
  faucet,
  providersApply,
} from './redux/account/actions';
export {
  setHelpersNetwork,
  etherscanAddress,
  etherscanTx,
  etherscanToken,
  thousandsDelimiter,
  addressShortifier,
  hashShortifier,
  timeZoneName,
  trim,
} from './helpers';

export { uiReducer, networkReducer } from './redux/reducer';

/**
 * Assets
 */
export { default as logo } from './images/logo.svg';
export { default as bull } from './images/bull.png';
export { default as metamask } from './images/metamask.png';
export { default as icoBriefcase } from './images/svg/briefcase';
export { default as icoInbox } from './images/svg/inbox';
export { default as icoPaperPlane } from './images/svg/paper-plane';
export { default as icoHandshake } from './images/svg/handshake';
export { default as icoHelp } from './images/svg/help';
export { default as icoWhitelist } from './images/svg/whitelist';
export { default as icoDividends } from './images/svg/dividends';

/**
 * Flow types
 */
export type { PUIState } from './redux/reducer';
export type { NetworkState } from './redux/reducer';
export type { ToastArgs } from './components/Toaster/Toaster';
export type { Notify } from './components/Toaster/actions';
export type { CountdownProps } from './components/Countdown';
