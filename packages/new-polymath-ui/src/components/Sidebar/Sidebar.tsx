import React, { FC } from 'react';
import { List } from 'reakit';
import styled from '~/styles';
import { Item } from './Item';

const Container = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  width: 64px;
  height: 100%;
  padding-top: ${({ theme }) => theme.header.height};
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: ${({ theme }) => theme.zIndexes.sidebar};
`;

export const Sidebar: FC = ({ children, ...props }) => (
  <Container {...props}>
    <List>{children}</List>
  </Container>
);

Object.assign(Sidebar, { Item });
