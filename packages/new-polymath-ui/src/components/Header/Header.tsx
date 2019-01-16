import React from 'react';
import BigNumber from 'bignumber.js';
import { formatters } from '@polymathnetwork/new-shared';

import * as sc from './styles';

import { PageWrap } from '~/components/PageWrap';
import { Box } from '~/components/Box';
import { Block } from '~/components/Block';
import { Icon } from '~/components/Icon';
import { IconCircled } from '~/components/IconCircled';
import { Link } from '~/components/Link';
import { List } from '~/components/List';
import { IconText } from '~/components/IconText';
import { InlineFlex } from '~/components/InlineFlex';

import polyLogo from '~/images/logo.svg';
import { SvgDot } from '~/images/icons/Dot';
import { SvgPoly } from '~/images/icons/Poly';
import { SvgAccount } from '~/images/icons/Account';
import { SvgToken } from '~/images/icons/Token';

export interface HeaderProps {
  network: string;
  walletAddress: string;
  balance?: BigNumber;
  variant: 'default' | 'transparent';
  symbol?: string;
  logo?: string;
  RouterLink: React.ComponentType;
}

export const Header = (props: HeaderProps) => {
  const {
    balance,
    walletAddress,
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
          {walletAddress ? (
            <Box ml="auto">
              <List className="pui-header-menu">
                <IconText>
                  <Icon
                    Asset={SvgDot}
                    aria-label="Active network"
                    color="success"
                    width={26}
                    height={26}
                  />
                  <InlineFlex ml="s">{network}</InlineFlex>
                </IconText>
                <IconText>
                  <IconCircled
                    Asset={SvgPoly}
                    aria-label="Your POLY balance"
                    bg="blue.0"
                    color="white"
                    width={26}
                    height={26}
                  />
                  <InlineFlex ml="s">
                    {balance ? formatters.toTokens(balance) + ' POLY' : '...'}
                  </InlineFlex>
                </IconText>
                <IconText>
                  <IconCircled
                    Asset={SvgAccount}
                    aria-label="Wallet address"
                    bg="blue.0"
                    color="white"
                    width={26}
                    height={26}
                  />
                  <InlineFlex ml="s">
                    {formatters.toShortAddress(walletAddress)}
                  </InlineFlex>
                </IconText>
                {symbol ? (
                  <IconText>
                    <IconCircled
                      Asset={SvgToken}
                      aria-label="Token"
                      bg="blue.0"
                      color="white"
                      width={26}
                      height={26}
                      scale={0.95}
                    />
                    <InlineFlex ml="s">{symbol}</InlineFlex>
                  </IconText>
                ) : (
                  ''
                )}
              </List>
            </Box>
          ) : null}
        </sc.Inner>
      </PageWrap>
    </sc.Wrapper>
  );
};

Header.defaultProps = {
  variant: 'default',
};
