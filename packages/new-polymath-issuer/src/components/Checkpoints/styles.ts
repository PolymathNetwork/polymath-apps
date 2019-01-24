import { styled, Box, List, IconOutlined } from '@polymathnetwork/new-ui';

export const iconSize = 25;

export const Container = styled(List)`
  margin-top: 60px;
`;

export const Checkpoints = styled.li`
  &:last-child {
  }
`;

export const Dividends = styled(Box)`
  position: relative;
  padding-left: ${({ theme }) =>
    `calc(${theme.space.gridGap} + ${iconSize / 2}px)`};

  &:before {
    position: absolute;
    content: '';
    width: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    left: 0;
    top: ${iconSize}px;
    bottom: ${({ theme }) => `-${theme.space.gridGap}`};
  }
`;

export const StepIcon = styled(IconOutlined)`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -${iconSize / 2}px;
`;
