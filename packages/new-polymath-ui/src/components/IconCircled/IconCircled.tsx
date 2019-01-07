import React from 'react';
import styled from 'styled-components';
import { bgColor, BgColorProps } from 'styled-system';

import { Icon, IconProps } from '~/components/Icon';

export interface IconCircledProps extends IconProps {
  bgColor: BgColorProps;
}

export const IconCircled = styled(Icon)`
  ${bgColor};
  border-radius: 50%;
  padding: 0.25rem;
`;

IconCircled.defaultProps = {
  width: '1rem',
  bg: 'blue[0]',
};

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconCircledDocz = (props: IconCircledProps) => {
  return <IconCircled {...props} />;
};
