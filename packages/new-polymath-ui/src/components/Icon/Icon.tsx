import React from 'react';
import styled, { StyledProps } from 'styled-components';

export interface IconProps extends StyledProps<any> {
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

export const Icon = styled(({ Asset, ...props }: IconProps) => (
  <Asset {...props} />
))`
  vertical-align: middle;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconDocz = (props: IconProps) => {
  return <Icon {...props} />;
};
