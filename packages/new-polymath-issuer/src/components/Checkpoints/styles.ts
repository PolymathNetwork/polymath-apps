import {
  styled,
  Box,
  List,
  Heading,
  IconOutlined,
} from '@polymathnetwork/new-ui';

export const iconSize = 25;

export const Container = styled(List)`
  margin-top: 60px;
`;

export const Year = styled(Heading).attrs({
  variant: 'h2',
})`
  position: absolute;
  top: ${({ theme }) => `-${theme.space[6]}`};
  padding-left: ${({ theme }) =>
    `calc(${theme.space.gridGap} + ${iconSize / 2}px)`};
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
    bottom: ${({ theme, isLastChild }) =>
      `-${isLastChild ? theme.space[7] : theme.space.gridGap}`};
  }
`;

export const YearCheckpoints = styled.li``;

export const Checkpoints = styled.li`
  position: relative;

  &:last-child ${YearCheckpoints}:last-child {
    ${Dividends}:before {
      bottom: ${({ theme }) => `-${theme.space.xl}`};
    }
  }
`;

export const StepIcon = styled(IconOutlined)`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -${iconSize / 2}px;
`;
