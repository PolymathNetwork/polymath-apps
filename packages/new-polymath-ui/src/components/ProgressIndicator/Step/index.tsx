import React, { FC } from 'react';
import { Paragraph } from '~/components/Paragraph';
import { SvgCheckmark } from '~/images/icons/Checkmark';
import * as sc from './styles';
import { iconsSize } from './styles';

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
  isVertical?: boolean;
  isOrdered?: boolean;
  index?: number;
}

export const Step: FC<StepProps> = ({
  label,
  index,
  isCurrent,
  isComplete,
  isVertical,
  isOrdered,
  ...otherProps
}) => {
  const stepNumber = (index || 0) + 1;

  const NumberedSvg: FC = () => (
    <Paragraph as="span" fontWeight="bold" fontSize="inherit">
      {stepNumber}
    </Paragraph>
  );

  const CurrentStepSvg: FC<React.SVGAttributes<SVGElement>> = props => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <title>Current step</title>
      <circle fill="currentColor" cx="12" cy="12" r="8" />
    </svg>
  );
  const IncompleteStepSvg: FC<React.SVGAttributes<SVGElement>> = (
    props: React.SVGAttributes<SVGElement>
  ) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <title>Incomplete step</title>
      <circle fill="currentColor" cx="12" cy="12" r="8" />
    </svg>
  );

  const CompleteSvg = isComplete && SvgCheckmark;
  const CurrentSvg = isCurrent && (isOrdered ? NumberedSvg : CurrentStepSvg);
  const IncompleteSvg =
    !isComplete && isOrdered ? NumberedSvg : IncompleteStepSvg;

  return (
    <sc.Container
      isCurrent={isCurrent}
      isComplete={isComplete}
      isVertical={isVertical}
      {...otherProps}
    >
      <sc.Inner>
        <sc.Icon
          Asset={CurrentSvg || CompleteSvg || IncompleteSvg}
          width={iconsSize}
          height={iconsSize}
          scale={0.9}
        />
        {!!label && (
          <sc.Label
            mb={0}
            mt={isVertical ? 0 : `calc(${iconsSize} / 2)`}
            ml={isVertical ? `calc(${iconsSize} / 2)` : 0}
            fontWeight="bold"
            fontSize="inherit"
          >
            {label}
          </sc.Label>
        )}
      </sc.Inner>
      <sc.ProgressLine />
    </sc.Container>
  );
};
