import React from 'react';
import 'jest-dom/extend-expect';
import { ProgressIndicator } from '../ProgressIndicator';
import { render, getByTestId } from '~/testUtils/helpers';

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
      const rendered = render(
        <ProgressIndicator vertical currentIndex={0} ordered>
          <ProgressIndicator.Step label="First Step" data-testid="first-step" />
          <ProgressIndicator.Step
            label="Second Step"
            data-testid="second-step"
          />
        </ProgressIndicator>
      );

      const { container, getAllByTitle, getByText, debug } = rendered;

      const byTitle = getAllByTitle('Current step');
      expect(byTitle.length).toEqual(1);

      const firstStep = rendered.getByTestId('ProgressIndicator-Step-1');
      const secondStep = rendered.getByTestId('ProgressIndicator-Step-2');

      // Since it is the current step it should not show its number
      expect(firstStep).not.toHaveTextContent('1');
      expect(firstStep).toHaveTextContent('Current step');

      expect(secondStep).toHaveTextContent('2');
    });
  });
});
