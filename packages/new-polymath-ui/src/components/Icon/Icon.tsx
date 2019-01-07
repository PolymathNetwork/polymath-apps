import React, { FC } from 'react';
import styled from 'styled-components';
import { color, ColorProps } from 'styled-system';

export type IconProps = {
  Asset: React.ComponentType<{ [key: string]: any }> | string;
  [key: string]: any;
} & ColorProps;

const IconPrimitive: FC<IconProps> = ({
  Asset,
  color: colorProp,
  ...props
}) => {
  if (typeof Asset === 'string') {
    return <img {...props} src={Asset} />;
  }

  // TODO @RafaelVidaurre: Remove this, only for manual testing
  if (!Asset) {
    return <img src="img" />;
  }

  return <Asset {...props} />;
};

export const Icon = styled(IconPrimitive)`
  vertical-align: middle;
  ${color};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconDocz = (props: IconProps) => {
  return <Icon {...props} />;
};
