/**
 * Temporary component that has the purpose of enabling compability between
 * Modern and Legacy.
 *
 * NOTE: This component should be removed once Legacy is fully deprecated
 */
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ReduxLittleRouterLink } from 'redux-little-router';

export const RouterLink = (props: any) => {
  if (process.env.IS_LEGACY) {
    const { href, ...rest } = props;
    return <ReactRouterLink {...rest} to={href} />;
  }

  return <ReduxLittleRouterLink {...props} />;
};
