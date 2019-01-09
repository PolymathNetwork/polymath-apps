import React, { FC } from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';

import { Paragraph, ParagraphProps } from '~/components/Paragraph';

const headingStyle = variant({
  key: 'headings',
});

export interface HeadingProps extends ParagraphProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
}

export const Heading = styled(Paragraph)<HeadingProps>`
  ${headingStyle};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const HeadingDocz: FC<HeadingProps> = (props: any) => {
  return <Heading {...props} />;
};

Heading.defaultProps = {
  as: 'h2',
  variant: 'h3',
  lineHeight: 'normal',
  mt: 0,
  mb: 'm',
};
