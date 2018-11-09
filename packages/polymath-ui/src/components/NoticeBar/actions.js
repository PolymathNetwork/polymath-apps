// @flow

import { notice as fetchNotice } from '../../offchain';
import type { ExtractReturn } from '../../redux/helpers';

export const NOTICE = 'polymath/ui/notice/NOTICE';
export const getNotice = (scope: string, address: string) => async (
  dispatch: Function
) => {
  const addressesWithOldTokens = [
    '0xfD4c0F5848642FC2041c003cb684fc66B16217bc',
    '0x27448B14A7c16c613b4e8Ef4Fdc26283955e994B',
    '0xd87cC86789c79bb02043463efC94D8E76E328A98',
    '0x029023C27209275d383B9d882FF751bf73Fd7730',
    '0x212bc2ED72CBC59E9856E8008fD52CaFF627aCB4',
    '0x8f28E1cC162427b1731D6e1365F546398a7e2Ed4',
    '0x9cCA7aF95C6e276ae8078DB81a3e44814a16b28b',
    '0x55bcB10966588F978e34C57cC9e52AE7121cC8A4',
    '0x4784B5c52545f8152001c0358Fef15B5C72231f1',
    '0x5D9e154076A1F5A51510Fcd6ea028326C2de0907',
    '0xcAae790A10E8F8f13C55461FCAbB6769998b899A',
    '0xD52d25C8B6e3704AAb3D8bE8e1A33a5da070C2a9',
    '0xA912709f8E0E16ABC8FAC2d575bdB8374a839977',
    '0x3d47BA637D342B25Af7cCd6E0e47DF47ae1D1Efb',
    '0x2e31AE306D7CDd0bc9e75d38Ad19A26F0e337842',
    '0x1A9638cd2b54B213717031ccab15Af672cA4e506',
    '0xeE8f150257b3ff397CDcb3eB14b6fd5763cc7244',
    '0x9f86C2105849F8aF776F841e312f20122c05F40F',
    '0xbE95Ea3B00285D580CfD737d626082c0514BF675',
    '0x3AE1f3D1B5546D62035A2c5112e854f292ACf2FA',
    '0xADb7f88443cFad5A6852133e177402c1aCb866Fe',
    '0xe619Bd7a7e8fB0856A0E52416e9cDB4f05E5DebA',
    '0xC6860754aC59C9EC82B2dB3147862d59685f164f',
    '0x8f2FbD03AEA3e71409A583Bc54118cA56993147D',
    '0xC6860754aC59C9EC82B2dB3147862d59685f164f',
    '0x774FB4524D82Bf595852A9B3Ef04F466AEe77161',
    '0x8B8c315DC26413520DD53826a4c0C9d947c3Ba70',
    '0x8A1d0a7c9682019C204bF08C0Ecc75C13675be58',
    '0x45D80dcf9dC5E403d56bAe7511d44319Dad76Bbe',
    '0x44F97283227fDFf79c48658A9435e7a13019037f',
    '0x20b0daD4d4a3b12d515bEEb90c096A16Fae33B93',
    '0xA32E2d4AE94615B49B270c9E102f94a3D26157Fe',
    '0xD52d25C8B6e3704AAb3D8bE8e1A33a5da070C2a9',
    '0xf15D7500FD1Efb28111dbb9a2CeC1831911Edeea',
    '0x869bdDe33E9737f569f1B66a4840c8aF4281cc0C',
    '0x36e35A4913F964284674b1E48c597E92545cA7ab',
    '0xeC615449e4F38647F4B04425503fEfF069Bee571',
    '0x44F97283227fDFf79c48658A9435e7a13019037f',
    '0x32296c3b8653a5f00C08216dCAd03882A8BE768E',
    '0xF7Fa305e3609f1a94Ee025c86aF51D9F2b2648E4',
    '0xADC283F41BC4B9bD698827e8c85dF80B5fbb76cF',
    '0x1e3ae713abc1370886D35ec2b725C66f7DE3651D',
  ];

  // if the issuer is in the list, show the special notification
  if (addressesWithOldTokens.find(notifyAddress => notifyAddress === address)) {
    dispatchTemporaryNotice(dispatch);
    return;
  }

  const notice = await fetchNotice(scope);
  if (!notice) {
    return;
  }
  if (notice.isOneTime) {
    // eslint-disable-next-line no-underscore-dangle
    const lsId = 'notice-' + notice._id;
    if (localStorage.getItem(lsId)) {
      return;
    }
    localStorage.setItem(lsId, true);
  }
  dispatch({ type: NOTICE, notice });
};

/**
 * NOTE @monitz87: this is a temporary function to notify issuers about the upcoming update
 * and security token migration in 11/15/2018. It should be removed after the upgrade
 */
const dispatchTemporaryNotice = (dispatch: Function) => {
  const notice = {
    type: 'warning',
    scope: 'issuer',
    title: 'New Release',
    content:
      'Polymath is currently migrating your security tokens to an upgraded 2.0 release. Token distribution is disabled during this period and will resume by Nov. 15th - 12:00pm ET. We hope you enjoy the added functionality of your upgraded security tokens, and we apologize for any inconvenience.',
    isValid: true,
  };

  /**
   * NOTE @monitz87: uncomment the following code if we want the pre-release notice
   * to be one-time only (for now it is persistent)
   */
  // const lsId = 'notice-temp-token-migration';
  // if (localStorage.getItem('notice-temp-token-migration')) {
  //   return;
  // }
  // localStorage.setItem(lsId, true);

  dispatch({ type: NOTICE, notice });
};

export const CLOSE = 'polymath/ui/notice/CLOSE';
export const closeNotice = () => ({ type: CLOSE });

export type Action = ExtractReturn<typeof closeNotice>;
