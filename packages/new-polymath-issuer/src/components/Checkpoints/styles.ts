import {
  styled,
  Flex,
  List,
  Heading,
  IconOutlined,
  Button,
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
  padding-left: ${({ theme }) => theme.space.gridGap};
`;

export const Dividends = styled(Flex)`
  position: relative;
  padding-left: ${({ theme }) => theme.space.gridGap};
`;

export const ProgressIndicator = styled.div<{ isLastChild: boolean }>`
  position: absolute;
  width: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  left: ${({ theme }) => `calc(-${theme.space.gridGap} / 2)`};
  top: ${iconSize}px;
  bottom: ${({ theme, isLastChild }) =>
    `-${isLastChild ? theme.space[7] : theme.space.gridGap}`};
`;

export const YearCheckpoints = styled.li``;

export const Checkpoints = styled.li`
  position: relative;

  &:last-child ${YearCheckpoints}:last-child {
    ${ProgressIndicator} {
      bottom: ${({ theme }) => `-${theme.space.xl}`};
    }
  }
`;

export const StepIcon = styled(IconOutlined)`
  position: absolute;
  top: -${iconSize}px;
  left: 0;
  margin-left: -${iconSize / 2}px;
`;

export const NewDividendButton = styled(Button)`
  flex-direction: column;
  align-items: center;
`;
