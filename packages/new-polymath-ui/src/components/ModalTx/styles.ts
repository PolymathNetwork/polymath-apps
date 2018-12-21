import { maxWidth, MaxWidthProps } from 'styled-system';

import styled, { css, ThemeInterface } from '~/styles';

import { ModalStatus } from './Modal';
import { IconButton } from '../IconButton';

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.gray[2]};
  height: 44px;
  width: 44px;
  padding: 17px;
  overflow: hidden;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.gray[3]};
  }
`;
