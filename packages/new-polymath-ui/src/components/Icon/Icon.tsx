import React, { FC } from 'react';
import styled, { StyledProps } from 'styled-components';
import { color, ColorProps } from 'styled-system';

export interface IconProps extends StyledProps<any> {
  color: ColorProps;
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

const IconPrimitive: FC<IconProps> = ({
  Asset,
  color: colorProps,
  ...props
}) => {
  // TODO @grsmto: remove this once Webpack SVGR loader is fixed
  if (typeof Asset === 'string') {
    return <img {...props} src={Asset} />;
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
