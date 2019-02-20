import React, { FC } from 'react';
import styled, { StyledProps } from 'styled-components';
import { color, width, height, TLengthStyledSystem } from 'styled-system';

export interface IconProps extends StyledProps<any> {
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
  width: TLengthStyledSystem;
  height: TLengthStyledSystem;
  color?: string;
  scale?: number;
}

const IconComponent: FC<IconProps> = ({
  Asset,
  color,
  width,
  height,
  scale,
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

export const Icon = styled(IconComponent)<IconProps>`
  display: inline-block;
  vertical-align: middle;
  ${color};
  ${width};
  ${height};

  svg {
    display: block;
    width: 100%;
    height: 100%;
    padding: ${({ scale }) => `${(1 - scale!) * 100 + 10}%`};
  }
`;

Icon.defaultProps = {
  width: '1em',
  height: '1em',
  scale: 1,
};

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconDocz = (props: IconProps) => {
  return <Icon {...props} />;
};
