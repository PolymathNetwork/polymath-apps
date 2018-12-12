import React from 'react';

import { Page, PageProps } from '../Page';
import { Grid } from '../Grid';

export interface PageCenteredProps extends PageProps {}

export const PageCentered = ({ children, ...props }: PageCenteredProps) => (
  <Page as={Grid} alignItems="center" justifyContent="center" {...props}>
    {children}
  </Page>
);
