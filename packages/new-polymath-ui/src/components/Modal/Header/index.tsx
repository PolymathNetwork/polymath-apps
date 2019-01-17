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
  [ModalStatus.loading]: 'idle',
  [ModalStatus.idle]: 'idle',
  [ModalStatus.warning]: 'warning',
  [ModalStatus.alert]: 'alert',
  [ModalStatus.success]: 'success',
};

export const Header: FC<HeaderProps> = ({
  status = ModalStatus.idle,
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
  status: ModalStatus.idle,
};
