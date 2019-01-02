import React, { FC } from 'react';

import { Paragraph } from '~/components/Paragraph';
import { Heading } from '~/components/Heading';

import { ModalStatus } from '../types';

export interface HeaderProps {
  label?: string;
  status: ModalStatus;
  children: React.ReactNode;
}

const color = {
  [ModalStatus.loading]: 'idle',
  [ModalStatus.idle]: 'idle',
  [ModalStatus.warning]: 'warning',
  [ModalStatus.alert]: 'alert',
  [ModalStatus.success]: 'success',
};

export const Header: FC<HeaderProps> = props => {
  return (
    <React.Fragment>
      {props.label && (
        <Paragraph color={color[props.status]} fontSize={1} bold mb={1}>
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
  status: ModalStatus.idle,
};
