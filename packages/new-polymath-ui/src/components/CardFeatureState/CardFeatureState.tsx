import React from 'react';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import * as sc from './styles';

export interface CardFeatureStateProps {
  status: 'inactive' | 'idle' | 'warning';
  IconAsset: React.ComponentType<React.SVGAttributes<SVGElement>>;
  children: React.ReactNode;
  style: Object,
  maxWidth: Number,
}

export const CardFeatureState = ({
  status,
  IconAsset,
  children,
  style,
  maxWidth,
}: CardFeatureStateProps) => {
  return (
    <sc.Wrapper
      status={status}
      rounded
      textAlign="center"
      maxWidth={maxWidth}
      ml="auto"
      p={0}
    >
      <Box style={style} p={4}>
        <Icon Asset={IconAsset} width={64} height={64} color={status} />
        {children}
      </Box>
    </sc.Wrapper>
  );
};

CardFeatureState.defaultProps = {
  status: 'idle',
  maxWidth: 355,
};
