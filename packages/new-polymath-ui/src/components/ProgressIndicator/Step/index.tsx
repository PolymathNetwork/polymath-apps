import React from 'react';
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

const iconsSize = '1em';

const Container = styled.li<StepProps>`
  position: relative;
  text-align: center;
  min-width: 7rem;
  transition: 250ms all cubic-bezier(0.5, 0, 0.1, 1);
  overflow: visible;
  color: ${({ theme, isComplete, isCurrent }) =>
    (!isCurrent && !isComplete && theme.colors.gray[2]) ||
    theme.colors.primary};
  flex: 1 1;

  ${({ vertical }) =>
    vertical
      ? `
      display: flex;
      align-items: flex-end;

      &:first-child {
        flex: none;
      }

      ${ProgressLine} {
        left: calc(${iconsSize} / 2);
        top: 0;
        width: 2px;
        height: calc(100% - ${iconsSize});
      }

      ${Inner} {
        display: flex;
        align-items: center;
      }
      `
      : `
      ${ProgressLine} {
        top: calc(${iconsSize} / 2);
        right: calc(50% + (${iconsSize} / 2));
        height: 2px;
        width: calc(100% - ${iconsSize});
      }

      ${StyledIcon} {
        margin: auto;
      }
    `};
`;

const ProgressLine = styled.span`
  position: absolute;
  background-color: currentColor;

  ${Container}:first-child & {
    display: none;
  }
`;

const StyledIcon = styled(Icon)`
  display: block;
`;

const Label = styled(Paragraph)`
  line-height: ${iconsSize};
  color: currentColor;
`;

const Inner = styled.div``;

export const Step = ({ label, isCurrent, isComplete, vertical }: StepProps) => {
  const CompleteSvg = isComplete && SvgChecklist;

  const CurrentSvg =
    isCurrent &&
    ((props: React.SVGAttributes<SVGElement>) => (
      <svg role="img" viewBox="0 0 24 24" {...props}>
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
      <svg role="img" viewBox="0 0 24 24" {...props}>
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
      <Inner>
        <StyledIcon
          Asset={CurrentSvg || CompleteSvg || IncompleteSvg}
          width={iconsSize}
          height={iconsSize}
        />
        {!!label && (
          <Label
            mb={0}
            mt={vertical ? 0 : `calc(${iconsSize} / 2)`}
            ml={vertical ? `calc(${iconsSize} / 2)` : 0}
            fontWeight="bold"
          >
            {label}
          </Label>
        )}
      </Inner>
      <ProgressLine />
    </Container>
  );
};
