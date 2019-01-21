import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Paragraph } from '~/components/Paragraph';
import { Icon } from '~/components/Icon';

import { SvgChecklist } from '~/images/icons/Checklist';

export interface StepProps {
  /**
   * Specify whether the step is the current step
   */
  isCurrent?: boolean;
  /**
   * Specify whether the step has been completed
   */
  isComplete?: boolean;
  /**
   * Provide the label for the <ProgressStep>
   */
  label?: string;
  vertical?: boolean;
  ordered?: boolean;
  index: number;
}

const iconsSize = 24;

const Container = styled.li<StepProps>`
  position: relative;
  text-align: center;
  min-width: 7rem;
  transition: 250ms all cubic-bezier(0.5, 0, 0.1, 1);
  overflow: visible;
  flex: 1 1;
  color: ${({ theme, isComplete, isCurrent }) =>
    (!isCurrent && !isComplete && theme.colors.gray[2]) ||
    theme.colors.primary};
  display: ${({ vertical }) => (vertical ? 'flex' : 'block')};
`;

const ProgressLine = styled.span<{ vertical?: boolean }>`
  position: absolute;
  background-color: currentColor;

  ${({ vertical }) =>
    vertical
      ? `
      left: ${iconsSize / 2}px;
      bottom: 100%;
      right: calc(50% + ${iconsSize / 2}px);
      width: 2px;
      height: calc(100% - ${iconsSize}px);
    `
      : `
      top: ${iconsSize / 2 + 1}px;
      right: calc(50% + ${iconsSize / 2}px);
      height: 2px;
      width: calc(100% - ${iconsSize}px);
    `};

  ${Container}:first-child & {
    display: none;
  }
`;

const Label = styled(Paragraph)`
  color: currentColor;
`;

export const Step = ({ label, isCurrent, isComplete, vertical }: StepProps) => {
  const CompleteSvg = isComplete && SvgChecklist;

  const CurrentSvg =
    isCurrent &&
    ((props: React.SVGAttributes<SVGElement>) => (
      <svg role="img" {...props}>
        <path
          fill="currentColor"
          d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z"
        />
        <circle fill="currentColor" cx="12" cy="12" r="6" />
        <title>Current step</title>
      </svg>
    ));

  const IncompleteSvg =
    !isComplete &&
    ((props: React.SVGAttributes<SVGElement>) => (
      <svg role="img" {...props}>
        <title>Incomplete step</title>
        <path
          fill="currentColor"
          d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z"
        />
      </svg>
    ));

  return (
    <Container
      isCurrent={isCurrent}
      isComplete={isComplete}
      vertical={vertical}
    >
      <Icon
        Asset={CurrentSvg || CompleteSvg || IncompleteSvg}
        width={iconsSize}
        height={iconsSize}
      />
      {!!label && (
        <Label mb={0} mt={1} fontWeight="bold">
          {label}
        </Label>
      )}
      <ProgressLine vertical={vertical} />
    </Container>
  );
};
