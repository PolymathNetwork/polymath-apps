import React from 'react';
import { color, ColorProps } from 'styled-system';
import styled from '~/styles';

export interface LinkProps {
  href?: string;
  to?: string;
}

export const Link = styled(({ href, to, ...rest }: LinkProps) => {
  const isExternal = !!href;
  const Tag = href ? 'a' : 'a';
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
