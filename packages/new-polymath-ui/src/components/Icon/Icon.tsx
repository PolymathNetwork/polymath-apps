import React, { FC } from 'react';
import styled, { StyledProps } from 'styled-components';
import {
  color,
  ColorProps,
  width,
  height,
  WidthProps,
  HeightProps,
} from 'styled-system';

export interface IconProps extends StyledProps<any> {
  color: ColorProps;
  width: WidthProps;
  height: HeightProps;
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

const IconPrimitive: FC<IconProps> = ({
  Asset,
  color,
  width,
  height,
  className,
  alt,
  ...props
}) => {
  return (
    <span className={className}>
      <Asset role="img" aria-label={alt} {...props} />
    </span>
  );
};

export const Icon = styled(IconPrimitive)`
  display: inline-block;
  vertical-align: middle;
  ${color};
  ${width};
  ${height};

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconDocz = (props: IconProps) => {
  return <Icon {...props} />;
};
