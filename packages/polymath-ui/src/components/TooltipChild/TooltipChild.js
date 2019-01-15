import React, { Fragment } from 'react';
// import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const TooltipChild = ({ tooltipContent, showTooltip, children, id }) => (
  <Fragment>
    <span data-tip data-for="TooltipChild" data-tip-disable={!showTooltip}>
      {children}
    </span>

    <ReactTooltip id="TooltipChild">
      <span>{tooltipContent}</span>
    </ReactTooltip>
  </Fragment>
);

export default TooltipChild;
