import React from 'react';

import { Page, PageProps } from '../Page';
import { Grid } from '../Grid';

export const PageCentered = ({ children, ...props }: PageProps) => (
  <Page as={Grid} alignItems="center" justifyContent="center" {...props}>
    {children}
  </Page>
);
