import { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Context } from '../Context';

export interface Props {}

export const Toolbar: FC<Props> = props => {
  const context = useContext(Context);
  const { children } = props;

  if (!context) {
    return null;
  }

  const { tableToolbarEl } = context;

  return (
    tableToolbarEl &&
    ReactDOM.createPortal(
      typeof children === 'function' ? children({ ...context }) : children,
      tableToolbarEl
    )
  );
};
