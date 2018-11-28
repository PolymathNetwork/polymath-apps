// @flow

import * as React from 'react';

import Paragraph from '../Paragraph';
import Heading from '../Heading';

type Props = {|
  label?: string,
  status?: string,
  children: React.Node,
|};

const Header = (props: Props) => {
  return (
    <React.Fragment>
      {props.label && (
        <Paragraph color={props.status} fontSize={1} bold mb={1}>
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
  status: 'idle',
};
