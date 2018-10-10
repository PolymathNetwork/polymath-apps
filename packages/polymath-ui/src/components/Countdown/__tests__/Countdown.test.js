import React from 'react';
import renderer from 'react-test-renderer';
import Countdown from '../Countdown';

describe('Countdown', () => {
  test('renders without crashing', () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2018-01-01T05:12:34').getTime());
    const deadline = new Date('2017-06-23T01:23:45');

    const component = renderer.create(
      <Countdown
        title="Time Left to Create Your Token"
        deadline={deadline}
        buttonTitle="Create Your Token Now"
        handleButtonClick={() => {}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Date.now.mockRestore();
  });
});
