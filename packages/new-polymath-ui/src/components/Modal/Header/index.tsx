import React, { FC } from 'react';

import { Paragraph } from '~/components/Paragraph';
import { Heading } from '~/components/Heading';

interface HeaderProps {
  label?: string;
  status?: string;
  children: React.ReactNode;
}

export const Header: FC<HeaderProps> = props => {
  return (
    <React.Fragment>
      {props.label && (
        <Paragraph
          color={props.status === 'loading' ? 'idle' : props.status}
          fontSize={1}
          bold
          mb={1}
        >
          {props.label}
        </Paragraph>
      )}
      <Heading as="h1" variant="h2" mb="m">
        {props.children}
      </Heading>
    </React.Fragment>
  );
};

Header.defaultProps = {
  status: 'idle',
};
