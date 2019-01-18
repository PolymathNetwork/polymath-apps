import React, { FC } from 'react';

import { Paragraph } from '~/components/Paragraph';
import { Heading } from '~/components/Heading';

import { ModalStatus } from '../types';

export interface HeaderProps {
  label?: string;
  status?: ModalStatus;
  children: React.ReactNode;
}

const color = {
  [ModalStatus.Loading]: 'idle',
  [ModalStatus.Idle]: 'idle',
  [ModalStatus.Warning]: 'warning',
  [ModalStatus.Alert]: 'alert',
  [ModalStatus.Success]: 'success',
};

export const Header: FC<HeaderProps> = ({
  status = ModalStatus.Idle,
  children,
  label,
}) => {
  return (
    <React.Fragment>
      {label && (
        <Paragraph color={color[status]} fontSize={1} bold mb={1}>
          {label}
        </Paragraph>
      )}
      <Heading as="h1" variant="h2" mb="m">
        {children}
      </Heading>
    </React.Fragment>
  );
};

Header.defaultProps = {
  status: ModalStatus.Idle,
};
