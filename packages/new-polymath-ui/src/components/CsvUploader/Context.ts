import React from 'react';
import { csvParser } from '@polymathnetwork/new-shared';
import { Config } from './ParseCsv';

export const Context = React.createContext<{
  isFullyInvalid: boolean;
  errorCount: number;
  data: csvParser.ResultProps;
  csvConfig: Config;
} | null>(null);
