import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Context } from '../Context';
import * as sc from './styles';

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
      <sc.Toolbar>
        {typeof children === 'function' ? children({ ...context }) : children}
      </sc.Toolbar>,
      tableToolbarEl
    )
  );
};
