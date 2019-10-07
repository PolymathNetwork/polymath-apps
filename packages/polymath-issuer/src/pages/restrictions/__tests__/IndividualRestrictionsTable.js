import { IndividualRestrictionsTable } from '../components/IndividualRestrictionsTable';
import renderer from 'react-test-renderer';
import React from 'react';
import configureStore from 'redux-mock-store';
import { theme, GlobalStyles } from '@polymathnetwork/ui';
import { shallow, mount, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import moment from 'moment';
import { Provider } from 'react-redux';
const mockStore = configureStore([]);

describe('Individual Restrictions Table Component', () => {
  it('should render correctly', () => {
    const props = {
      theme,
      individualRestrictions: [
        {
          address: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
          id: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
          customStartTime: '1641013200000',
          customEndTime: '1717473600000',
          rollingPeriodInDays: '20',
          customRestrictionType: '0',
          customAllowedTokens: '120',
          dailyStartTime: '1641013200000',
          dailyEndTime: '1717473600000',
          dailyRestrictionType: '1',
          dailyAllowedTokens: '1',
        },
        {
          address: '0x66f820a414680B5bcda5eECA5dea238543F42054',
          id: '0x66f820a414680B5bcda5eECA5dea238543F42054',
          customStartTime: '1641013200000',
          customEndTime: '1717473600000',
          rollingPeriodInDays: '10',
          customRestrictionType: '0',
          customAllowedTokens: '1000',
        },
        {
          address: '0xd9f346Bf88cA2cb7e11B0106018DE80A0169764D',
          id: '0xd9f346Bf88cA2cb7e11B0106018DE80A0169764D',
          customStartTime: '1641013200',
          customEndTime: '1717473600',
          rollingPeriodInDays: '10',
          customRestrictionType: '0',
          customAllowedTokens: '1000',
        },
        {
          address: '0xE2FACfbdEdB03EeBC6747498aea18f7bc97A7066',
          id: '0xE2FACfbdEdB03EeBC6747498aea18f7bc97A7066',
          dailyStartTime: '1569902400',
          dailyEndTime: '1570077000',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '100',
        },
        {
          address: '0xCaA749f1cf0110dbfCA59e3594EB845a166DE232',
          id: '0xCaA749f1cf0110dbfCA59e3594EB845a166DE232',
          dailyStartTime: '1569558600',
          dailyEndTime: '1569821400',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '100',
        },
        {
          address: '0x1B2D2797A56c9eBa12aa821D643aB0dBa66C3772',
          id: '0x1B2D2797A56c9eBa12aa821D643aB0dBa66C3772',
          customStartTime: '1641013200',
          customEndTime: '1717473600',
          rollingPeriodInDays: '20',
          customRestrictionType: '0',
          customAllowedTokens: '120',
          dailyStartTime: '1641013200',
          dailyEndTime: '1717473600',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '1000',
        },
        {
          address: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
          id: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
          dailyStartTime: '1569902400',
          dailyEndTime: '1570078800',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '100',
        },
        {
          address: '0xE853c56864A2ebe4576a807D26Fdc4A0adA51919',
          id: '0xE853c56864A2ebe4576a807D26Fdc4A0adA51919',
          dailyStartTime: '1569994200',
          dailyEndTime: '1572494400',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '1200',
        },
        {
          address: '0x3f517cF8cf3E7b8149Db333b8f3393Cb57bA1d3B',
          id: '0x3f517cF8cf3E7b8149Db333b8f3393Cb57bA1d3B',
          dailyStartTime: '1569988800',
          dailyEndTime: '1572409800',
          dailyRestrictionType: '0',
          dailyAllowedTokens: '100',
        },
      ],
    };
    const tree = shallow(<IndividualRestrictionsTable {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
