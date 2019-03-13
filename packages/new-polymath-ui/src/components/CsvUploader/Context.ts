import React from 'react';
import { csvParser } from '@polymathnetwork/new-shared';
import { Config } from './ParseCsv';

export type CsvContext<Output extends csvParser.Output> = {
  isFullyInvalid: boolean;
  errorCount: number;
  data: csvParser.ResultProps<Output>;
  csvConfig: Config;
} | null;

let context: any = null;

export const getContext = <Output extends csvParser.Output>(): React.Context<
  CsvContext<Output>
> => {
  if (context) {
    return context;
  }

  context = React.createContext<{
    isFullyInvalid: boolean;
    errorCount: number;
    data: csvParser.ResultProps<Output>;
    csvConfig: Config;
  } | null>(null);

  return context;
};
