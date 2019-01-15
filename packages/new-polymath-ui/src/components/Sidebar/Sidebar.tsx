import React, { FC } from 'react';
import { styled } from '~/styles';
import { List } from '~/components/List';
import { Item } from './Item';

const Container = styled.nav`
  width: 64px;
  padding-top: ${({ theme }) => theme.header.height};
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: ${({ theme }) => theme.zIndexes.sidebar};
`;

const SidebarBase: FC = ({ children, ...props }) => (
  <Container {...props}>
    <List>{children}</List>
  </Container>
);

export const Sidebar = Object.assign(SidebarBase, { Item });
