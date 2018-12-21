import React from 'react';

import * as S from './styles';

export interface LoadingProps {
  small?: boolean;
}

export const Loading = (props: LoadingProps) => {
  return (
    <S.Wrapper {...props}>
      <span />
      <span />
    </S.Wrapper>
  );
};
