import styled from 'styled-components';
import { Box } from '~/components/Box';
import { IconButton } from '~/components/IconButton';

export const ValueWrapper = styled(Box)`
  display: inline-flex;
  background-color: ${({ theme }) => theme.inputs.backgroundColor};
  border-radius: 50px;
  vertical-align: top;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[1]};
  margin-right: ${({ theme }) => theme.space[2]};
  margin-top: 7px;
`;

export const ValueLabel = styled(Box)`
  display: flex;
  margin-left: -${({ theme }) => theme.space[1]};
  margin-right: ${({ theme }) => theme.space[3]};
`;

export const ValueRemoveButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.inputs.backgroundColor};
  box-sizing: border-box;
  border-radius: 10px;

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
`;
