import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import Countdown from './';

import mockDate from '../../../config/jest/mockDate';

test('renders without crashing', () => {
  // We mock the Date() to always return the same date for snapshots to match
  mockDate('2017-06-13T04:41:20');

  const component = renderer.create(
    <Countdown
      title="Time Left to Create Your Token"
      deadline={new Date()}
      buttonTitle="Create Your Token Now"
      handleButtonClick={() => {}}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
