import React from 'react';
import { Api } from 'react-table';

export const Context = React.createContext<Api & { tableEl: Element } | null>(
  null
);
