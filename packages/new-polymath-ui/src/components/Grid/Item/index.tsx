import styled from 'styled-components';
import {
  gridColumn,
  gridRow,
  gridArea,
  GridColumnProps,
  GridRowProps,
  GridAreaProps,
} from 'styled-system';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Box } from '~/components/Box';

export type ItemProps = typeHelpers.GetProps<typeof Box> &
  GridColumnProps &
  GridRowProps &
  GridAreaProps;

export const Item = styled(Box)<ItemProps>`
  ${gridColumn};
  ${gridRow};
  ${gridArea};
`;
