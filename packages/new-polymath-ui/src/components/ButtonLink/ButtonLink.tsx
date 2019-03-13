import React from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Button } from '~/components/Button';
import { RouterLink as RouterLinkComponent } from '~/components/RouterLink';

export type ButtonProps = typeHelpers.GetProps<typeof Button>;

export interface Props extends typeHelpers.Omit<ButtonProps, 'onClick'> {
  RouterLink?: React.ComponentType<any>;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ButtonLinkBase = styled(
  ({ RouterLink, onClick, ...otherProps }: Props) => {
    const LinkComponent = RouterLink || RouterLinkComponent;
    return (
      <Button
        as={(props: ButtonProps) => {
          const { variant, iconPosition, ...filteredProps } = props;
          return <LinkComponent {...filteredProps} onClick={onClick} />;
        }}
        {...otherProps}
      />
    );
  }
)``;

export const ButtonLink = Object.assign(ButtonLinkBase, {
  defaultProps: Button.defaultProps,
});
