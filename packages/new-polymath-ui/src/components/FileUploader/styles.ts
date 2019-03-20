import { styled } from '~/styles';
import { Text } from '~/components/Text';
import { Box } from '~/components/Box';
import { InlineFlex } from '~/components/InlineFlex';
import { IconButton } from '~/components/IconButton';

export const Dropzone = styled(Box)`
  background-color: ${({ theme }) => theme.colors.gray[1]};
  border: 1px dashed ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  text-align: center;
  padding: ${({ theme }) => theme.space.m};
  cursor: pointer;
  transition-property: background-color, border-color;
  transition-duration: ${({ theme }) => theme.transitions.hover.ms}ms;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[0]};
    border-color: transparent;
  }
`;

export const File = styled(InlineFlex)`
  background-color: ${({ theme }) => theme.colors.gray[1]};
  padding: ${({ theme }) => theme.space.s};
`;

export const FileName = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const FileRemoveButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.inputs.backgroundColor};
  border-radius: 50%;
  margin-left: 10px;

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
`;
