import React, { Fragment } from 'react';
import { Tooltip } from '~/components/Tooltip';
import * as sc from './styles';

import { SvgInfo } from '../../images/icons/Info';

export interface TooltipIconProps extends TooltipProps {
  description: string;
}

export const TooltipIcon = ({ description, children }: TooltipIconProps) => (
  <Fragment>
    <sc.Icon
      aria-describedby={description}
      Asset={SvgInfo}
      width="16"
      height="16"
    />
    <Tooltip children={children} />
  </Fragment>
);
