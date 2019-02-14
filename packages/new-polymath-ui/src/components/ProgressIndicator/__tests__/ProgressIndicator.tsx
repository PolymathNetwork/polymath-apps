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
      const rendered = render(
        <ProgressIndicator vertical currentIndex={1} ordered>
          <ProgressIndicator.Step label="First Step" data-testid="first-step" />
          <ProgressIndicator.Step
            label="Second Step"
            data-testid="second-step"
          />
        </ProgressIndicator>
      );

      const firstStep = rendered.getByTestId('first-step');
      const secondStep = rendered.getByTestId('second-step');

      // Since it is the previous step it should not show its number
      expect(firstStep).not.toHaveTextContent('1');

      expect(secondStep).toHaveTextContent('2');
    });
  });
});
