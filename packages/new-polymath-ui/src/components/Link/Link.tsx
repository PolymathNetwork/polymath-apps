import React from 'react';
import { color, ColorProps } from 'styled-system';
import styled from '~/styles';

export type LinkProps = {
  href?: string;
  to?: string;
} & ColorProps;

export const Link = styled(({ href, to, ...rest }: LinkProps) => {
  const isExternal = !!href;
  let Tag = href ? 'a' : 'a'; // `Link from react-router for ex`
  let linkProps = {};

  if (isExternal) {
    linkProps = {
      ...linkProps,
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  } else {
    linkProps = {
      ...linkProps,
      to,
    };
  }

  return <Tag {...linkProps} {...rest} />;
})`
  text-decoration: underline;
  ${({ theme }) => theme.links};
  ${color};

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;
