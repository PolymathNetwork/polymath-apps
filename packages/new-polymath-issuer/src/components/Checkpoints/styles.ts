import {
  styled,
  Box,
  List,
  Heading,
  IconOutlined,
  ThemeInterface,
} from '@polymathnetwork/new-ui';
import { StyledComponent } from 'styled-components';

export const iconSize = 25;

export const Container: StyledComponent<
  React.ReactType<any>,
  ThemeInterface,
  any,
  never
> = styled(List)`
  margin-top: 60px;
`;

export const Year: StyledComponent<
  typeof Heading,
  ThemeInterface,
  any,
  'variant'
> = styled(Heading).attrs({
  variant: 'h2',
})`
  position: absolute;
  top: ${({ theme }) => `-${theme.space[6]}`};
  padding-left: ${({ theme }) => theme.space.gridGap};
`;

export const Dividends: StyledComponent<
  'div',
  ThemeInterface,
  any,
  never
> = styled(Box)`
  position: relative;
  padding-left: ${({ theme }) => theme.space.gridGap};
`;

export const ProgressIndicator: StyledComponent<
  'div',
  ThemeInterface,
  { isLastChild: boolean },
  never
> = styled.div<{ isLastChild: boolean }>`
  position: absolute;
  width: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  left: ${({ theme }) => `calc(-${theme.space.gridGap} / 2)`};
  top: ${iconSize}px;
  bottom: ${({ theme, isLastChild }) =>
    `-${isLastChild ? theme.space[7] : theme.space.gridGap}`};
`;

export const YearCheckpoints: StyledComponent<
  'li',
  ThemeInterface,
  {},
  never
> = styled.li``;

export const Checkpoints: StyledComponent<
  'li',
  ThemeInterface,
  {},
  never
> = styled.li`
  position: relative;

  &:last-child ${YearCheckpoints}:last-child {
    ${ProgressIndicator} {
      bottom: ${({ theme }) => `-${theme.space.xl}`};
    }
  }
`;

export const StepIcon: StyledComponent<
  typeof IconOutlined,
  ThemeInterface,
  {
    bg: string;
  },
  'bg'
> = styled(IconOutlined)`
  position: absolute;
  top: -${iconSize}px;
  left: 0;
  margin-left: -${iconSize / 2}px;
`;
