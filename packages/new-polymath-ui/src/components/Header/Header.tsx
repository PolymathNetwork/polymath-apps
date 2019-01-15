import React from 'react';
import BigNumber from 'bignumber.js';
import { formatters } from '@polymathnetwork/new-shared';

import * as sc from './styles';

import { PageWrap } from '~/components/PageWrap';
import { Flex } from '~/components/Flex';
import { Block } from '~/components/Block';
import { Icon } from '~/components/Icon';
import { IconCircled } from '~/components/IconCircled';
import { Link } from '~/components/Link';

import polyLogo from '~/images/logo.svg';
import { SvgDot } from '~/images/icons/Dot';
import { SvgPoly } from '~/images/icons/Poly';
import { SvgAccount } from '~/images/icons/Account';
import { SvgToken } from '~/images/icons/Token';

export interface HeaderProps {
  network: string;
  accountAddress: string;
  balance?: BigNumber;
  variant: 'default' | 'transparent';
  symbol?: string;
  logo?: string;
  RouterLink: React.ComponentType;
}

export const Header = (props: HeaderProps) => {
  const {
    balance,
    accountAddress,
    network,
    symbol,
    logo,
    variant,
    RouterLink,
  } = props;
  return (
    <sc.Wrapper className="pui-header" variant={variant}>
      <PageWrap>
        <sc.Inner>
          <Link as={RouterLink} href="/">
            {logo ? (
              <Block as="img" src={logo} alt="Company Logo" width="188" />
            ) : (
              <Block as="img" src={polyLogo} alt="Polymath" width="188" />
            )}
          </Link>
          {accountAddress ? (
            <Flex as="ul" ml="auto" className="pui-header-menu">
              <li>
                <Icon Asset={SvgDot} alt="Active network" />
                {network}
              </li>
              <li>
                <IconCircled Asset={SvgPoly} alt="Your POLY balance" />
                {balance ? formatters.toTokens(balance) + ' POLY' : '...'}
              </li>
              <li>
                <Icon Asset={SvgAccount} alt="Account address" />
                {formatters.toShortAddress(accountAddress)}
              </li>
              {symbol ? (
                <li>
                  <Icon Asset={SvgToken} alt="Token" />
                  {symbol}
                </li>
              ) : (
                ''
              )}
            </Flex>
          ) : null}
        </sc.Inner>
      </PageWrap>
    </sc.Wrapper>
  );
};

Header.defaultProps = {
  variant: 'default',
};
