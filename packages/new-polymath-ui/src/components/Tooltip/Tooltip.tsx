import React, { ComponentType, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

import * as sc from './styles';

import { SvgInfo } from '../../images/icons/Info';

export interface TooltipProps {
  triggerText: string;
  children: ComponentType;
  id?: string;
}

export const Tooltip = ({ triggerText, children, id }: TooltipProps) => (
  <Fragment>
    <sc.Label>{triggerText}</sc.Label>
    <sc.Icon
      data-tip
      data-for={id || triggerText}
      aria-describedby={id || triggerText}
      Asset={SvgInfo}
      width="16"
      height="16"
    />
    <sc.Container role="tooltip">
      <ReactTooltip
        id={id || triggerText}
        delayShow={200}
        delayHide={200}
        effect="solid"
        type="light"
        place="bottom"
      >
        {children}
      </ReactTooltip>
    </sc.Container>
  </Fragment>
);
