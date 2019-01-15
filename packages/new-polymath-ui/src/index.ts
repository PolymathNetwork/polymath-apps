import { theme } from './styles/theme';
import { SvgAccount } from './images/icons/Account';
import { SvgCalendar } from './images/icons/Calendar';
import { SvgCaretDown } from './images/icons/CaretDown';

// Styles
export * from './styles';

export { theme };

// Components
export { ErrorBoundary } from './components/ErrorBoundary';
export { ModalTransactionQueue } from './components/ModalTransactionQueue';
export { Button } from './components/Button';
export { Loading } from './components/Loading';
export { Header } from './components/Header';
export { Footer } from './components/Footer';
export { Page } from './components/Page';
export { StickyTop } from './components/StickyTop';
export { Icon } from './components/Icon';
export { IconCircled } from './components/IconCircled';
export { Sidebar } from './components/Sidebar';
export { Link } from './components/Link';
export { List } from './components/List';

// Icons
export const icons = {
  SvgAccount,
  SvgCalendar,
  SvgCaretDown,
};
