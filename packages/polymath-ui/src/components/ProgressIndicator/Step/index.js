import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Paragraph from '../../Paragraph';
import Icon from '../../Icon';

import TickIcon from '../../../images/icons/Tick';

const iconsSize = 24;

const Container = styled.li`
  position: relative;
  text-align: center;
  min-width: 7rem;
  transition: 250ms all cubic-bezier(0.5, 0, 0.1, 1);
  overflow: visible;
  flex: 1 1;
  color: ${({ theme, complete, current }) =>
    (!current && !complete && theme.colors.gray[2]) || theme.colors.primary};
`;

const ProgressLine = styled.span`
  position: absolute;
  top: ${iconsSize / 2 + 1}px;
  right: calc(50% + ${iconsSize / 2}px);
  height: 2px;
  width: calc(100% - ${iconsSize}px);
  background-color: currentColor;

  ${Container}:first-child & {
    display: none;
  }
`;

const Label = styled(Paragraph)`
  color: currentColor;
`;

const Step = ({ ...props }) => {
  const { label, description, current, complete } = props;

  const CompleteSvg = complete && TickIcon;

  const CurrentSvg =
    current &&
    (props => (
      <svg {...props}>
        <path
          fill="currentColor"
          d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z"
        />
        <circle fill="currentColor" cx="12" cy="12" r="6" />
        <title>{description}</title>
      </svg>
    ));

  const IncompleteSvg =
    !complete &&
    (props => (
      <svg {...props}>
        <title>{description}</title>
        <path
          fill="currentColor"
          d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z"
        />
      </svg>
    ));

  return (
    <Container current={current} complete={complete}>
      <Icon
        Icon={CurrentSvg || CompleteSvg || IncompleteSvg}
        width={iconsSize}
        height={iconsSize}
      />
      <Label mb={0} mt={1} fontWeight="bold">
        {label}
      </Label>
      <ProgressLine />
    </Container>
  );
};

Step.propTypes = {
  /**
   * Provide the label for the <ProgressStep>
   */
  label: PropTypes.node.isRequired,

  /**
   * Provide an optional className to be applied to the containing <li> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the step is the current step
   */
  current: PropTypes.bool,

  /**
   * Specify whether the step has been completed
   */
  complete: PropTypes.bool,

  /**
   * Provide a description for the <ProgressStep>
   */
  description: PropTypes.string,
};

export default Step;
