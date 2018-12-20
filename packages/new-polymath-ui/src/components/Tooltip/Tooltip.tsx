import React, { ComponentType, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

import * as S from './styles';

import InfoIcon from '../../images/icons/Info';

export interface TooltipProps {
  triggerText: string;
  children: ComponentType;
  id?: string;
}

export const Tooltip = ({ triggerText, children, id }: TooltipProps) => (
  <Fragment>
    <S.Label>{triggerText}</S.Label>
    <S.Icon
      data-tip
      data-for={id || triggerText}
      aria-describedby={id || triggerText}
      Asset={InfoIcon}
      width="16"
      height="16"
    />
    <S.Container role="tooltip">
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
    </S.Container>
  </Fragment>
);
