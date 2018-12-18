import React, { FC } from 'react';

import { Page, Props as PageProps } from '../Page';
import { Grid } from '../Grid';

export interface PageCenteredProps extends PageProps {}

export const PageCentered: FC<PageCenteredProps> = ({ children, ...props }) => (
  <Page as={Grid} alignItems="center" justifyContent="center" {...props}>
    {children}
  </Page>
);
