import React from 'react';
import styled, { StyledProps } from 'styled-components';
import {
  color,
  ColorProps,
  width,
  WidthProps,
  height,
  HeightProps,
} from 'styled-system';

export interface IconProps extends StyledProps<any> {
  color: ColorProps;
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>> | string;
}

const IconPrimitive: FC<IconProps> = ({
  Asset,
  color: colorProp,
  ...props
}) => {
  if (typeof Asset === 'string') {
    return <img {...props} src={Asset} />;
  }

  return <Asset {...props} />;
};

export const Icon = styled(IconPrimitive)`
  vertical-align: middle;
  ${color};
  ${width};
  ${height};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconDocz = (props: IconProps) => {
  return <Icon {...props} />;
};
