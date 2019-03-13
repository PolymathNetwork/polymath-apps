import React from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Icon } from '~/components/Icon';

type IconProps = typeHelpers.GetProps<typeof Icon>;

export const IconCircled = styled(Icon)<IconProps>`
  border-radius: 50%;
`;

IconCircled.defaultProps = {
  ...Icon.defaultProps,
  bg: 'blue[0]',
  scale: 0.9,
};

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const IconCircledDocz = (props: IconProps) => {
  return <IconCircled {...props} />;
};
