import React, { Fragment } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import Icon from '../Icon';

import InfoIcon from '../../images/icons/Info';

const StyledContainer = styled.div`
  .__react_component_tooltip {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    max-width: 15rem;
    background-color: white;
    padding: 1rem;
    border: 1px solid #dfe3e6;
    word-wrap: break-word;
    pointer-events: auto;
    border-radius: 0;
    transition: none;
    font-weight: normal;
    font-size: ${({ theme }) => theme.fontSizes.baseText};

    &.show {
      opacity: 1;
    }

    &.place-top:before {
      border-top: 8px solid rgba(0, 0, 0, 0.05);
    }

    &.place-bottom:before {
      border-bottom: 8px solid #dfe3e6;
    }
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const StyledText = styled.span`
  vertical-align: middle;
  line-height: 1;
  margin-right: 4px;
`;

const StyledIcon = styled(Icon)`
  transition: ${({ theme }) => `color ${theme.transitions.hover.ms}ms`};
  color: ${({ theme }) => theme.colors.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.blue[0]};
  }
`;

const Tooltip = ({ triggerText, children, id }) => (
  <Fragment>
    <StyledText>{triggerText}</StyledText>
    <StyledIcon
      data-tip
      data-for={id || triggerText}
      aria-describedby={id || triggerText}
      Icon={InfoIcon}
      width="16"
      height="16"
    />
    <StyledContainer role="tooltip">
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
    </StyledContainer>
  </Fragment>
);

export default Tooltip;

Tooltip.defaultProps = {};
