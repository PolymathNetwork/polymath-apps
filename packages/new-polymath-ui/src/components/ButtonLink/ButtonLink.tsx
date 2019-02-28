import React from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Button } from '~/components/Button';

export type ButtonProps = typeHelpers.GetProps<typeof Button>;

export interface Props extends ButtonProps {
  RouterLink: React.ComponentType<any>;
}

export const ButtonLinkBase = styled(({ RouterLink, ...otherProps }: Props) => (
  <Button
    as={(props: ButtonProps) => {
      const { variant, iconPosition, ...filteredProps } = props;
      return <RouterLink {...filteredProps} />;
    }}
    {...otherProps}
  />
))``;

export const ButtonLink = Object.assign(ButtonLinkBase, {
  defaultProps: Button.defaultProps,
});
