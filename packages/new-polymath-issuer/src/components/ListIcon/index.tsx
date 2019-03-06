import React from 'react';
import { IconCircled, icons, styled } from '@polymathnetwork/new-ui';

export const ListIcon = styled(({ active, ...otherProps }) => (
  <IconCircled
    Asset={icons.SvgCaretDown2}
    bg="inactive"
    color="gray.1"
    width={24}
    height={24}
    scale={0.75}
    {...otherProps}
  />
))`
  transform: rotateZ(0.75turn);
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;
