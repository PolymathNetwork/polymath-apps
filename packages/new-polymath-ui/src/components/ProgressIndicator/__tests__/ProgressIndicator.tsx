import { within } from 'react-testing-library';
import React from 'react';
import { ProgressIndicator } from '../ProgressIndicator';
import { render } from '~/testUtils/helpers';

describe('ProgressIndicator', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <ProgressIndicator vertical currentIndex={0}>
        <ProgressIndicator.Step label="foo" />
      </ProgressIndicator>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe('ordered', () => {
    test('correctly numbers the steps', () => {
      const { getByTestId } = render(
        <ProgressIndicator vertical currentIndex={1} ordered>
          <ProgressIndicator.Step label="First Step" data-testid="first-step" />
          <ProgressIndicator.Step
            label="Second Step"
            data-testid="second-step"
          />
          <ProgressIndicator.Step label="Third Step" data-testid="third-step" />
        </ProgressIndicator>
      );

      const firstStep = getByTestId('first-step');
      const secondStep = getByTestId('second-step');
      const thirdStep = getByTestId('third-step');

      // Since it is a completed step it should not show its number
      expect(firstStep).not.toHaveTextContent('1');
      expect(secondStep).toHaveTextContent('2');
      expect(thirdStep).toHaveTextContent('3');
    });
  });

  test('marks next steps as incomplete', () => {
    const { debug, getByTestId } = render(
      <ProgressIndicator vertical currentIndex={0}>
        <ProgressIndicator.Step label="First Step" data-testid="first-step" />
        <ProgressIndicator.Step label="Second Step" data-testid="second-step" />
        <ProgressIndicator.Step label="Third Step" data-testid="third-step" />
      </ProgressIndicator>
    );

    const firstStep = getByTestId('ProgressIndicator-Step-1');
    const secondStep = getByTestId('ProgressIndicator-Step-2');
    const thirdStep = getByTestId('ProgressIndicator-Step-3');

    expect(() => {
      within(firstStep).getByTestId('IncompleteStepSvg');
    }).toThrow();
    within(secondStep).getByTestId('IncompleteStepSvg');
    within(thirdStep).getByTestId('IncompleteStepSvg');
  });
});
