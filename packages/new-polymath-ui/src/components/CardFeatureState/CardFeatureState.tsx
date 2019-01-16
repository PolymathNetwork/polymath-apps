import React from 'react';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import * as sc from './styles';

export interface CardFeatureStateProps {
  status: 'inactive' | 'idle' | 'warning';
  IconAsset: React.ComponentType<React.SVGAttributes<SVGElement>>;
  children: React.ReactNode;
}

export const CardFeatureState = ({
  status,
  IconAsset,
  children,
}: CardFeatureStateProps) => {
  return (
    <sc.Wrapper
      status={status}
      rounded
      textAlign="center"
      maxWidth={355}
      ml="auto"
      p={0}
    >
      <Box p="l">
        <Icon Asset={IconAsset} width={70} height={70} color="inactive" />
        {children}
      </Box>
    </sc.Wrapper>
  );
};

CardFeatureState.defaultProps = {
  status: 'idle',
};
