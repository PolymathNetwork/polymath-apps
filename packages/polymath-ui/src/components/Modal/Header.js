// @flow

import * as React from 'react';

import Paragraph from '../Paragraph';
import Heading from '../Heading';

type Props = {|
  label?: string,
  variant?: string,
  children: React.Node,
|};

const Header = (props: Props) => {
  return (
    <React.Fragment>
      {props.label && (
        <Paragraph color={props.variant} fontSize={1} bold mb={0}>
          {props.label}
        </Paragraph>
      )}
      <Heading as="h1" variant="h2" mb="m">
        {props.children}
      </Heading>
    </React.Fragment>
  );
};

export default Header;

Header.defaultProps = {
  variant: 'warning',
};
