import React, { Fragment } from 'react';
// import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const ButtonTooltip = ({ triggerText, showTooltip, children, id }) => (
  <Fragment>
    <span data-tip data-for="buttonTooltip" data-tip-disable={!showTooltip}>
      {children}
    </span>

    <ReactTooltip id="buttonTooltip">
      <span>{triggerText}</span>
    </ReactTooltip>
  </Fragment>
);

export default ButtonTooltip;

ButtonTooltip.defaultProps = {};
