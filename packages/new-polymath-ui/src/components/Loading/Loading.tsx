import React from 'react';

import * as sc from './styles';

export interface LoadingProps {
  small?: boolean;
}

export const Loading = (props: LoadingProps) => {
  return (
    <sc.Wrapper {...props}>
      <span />
      <span />
    </sc.Wrapper>
  );
};
