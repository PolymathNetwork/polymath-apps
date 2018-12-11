import React from 'react';
import styled from 'styled-components';

export interface IconProps {
  Asset: React.ComponentType;
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
