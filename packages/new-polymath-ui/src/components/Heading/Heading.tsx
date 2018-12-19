import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';

import { Paragraph, ParagraphProps } from '../Paragraph';

type Variants = {
  h1: any;
  h2: any;
  h3: any;
  h4: any;
};

const headingStyle = variant({
  key: 'headings',
});

export interface HeadingProps extends ParagraphProps {
  variant: keyof Variants;
}

export const Heading = styled(Paragraph)<HeadingProps>`
  ${headingStyle};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const HeadingDocz = (props: HeadingProps) => {
  return <Heading {...props} />;
};

Heading.defaultProps = {
  variant: 'h3',
  as: 'h2',
  lineHeight: 'normal',
  mb: 'm',
};
