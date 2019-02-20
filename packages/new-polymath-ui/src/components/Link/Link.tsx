import React from 'react';
import { color } from 'styled-system';
import { styled } from '~/styles';

const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const Link = styled(({ href, ...rest }: LinkProps) => {
  const isExternal = href && href.match(urlRegex);
  let linkProps = {};

  if (isExternal) {
    linkProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return <a href={href} {...linkProps} {...rest} />;
})`
  text-decoration: underline;
  ${({ theme }) => theme.links};
  ${color};

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;
