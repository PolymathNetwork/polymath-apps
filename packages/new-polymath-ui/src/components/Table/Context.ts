import React from 'react';
import { Api } from 'react-table';

export const Context = React.createContext<
  | Api & {
      tableBodyEl: Element | null;
      tableToolbarEl: Element | null;
      isTableEmpty: boolean;
    }
  | null
>(null);
