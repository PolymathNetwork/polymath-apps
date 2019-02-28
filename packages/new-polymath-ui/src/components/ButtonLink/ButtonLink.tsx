import React from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Button } from '~/components/Button';

type ButtonProps = typeHelpers.GetProps<typeof Button>;

interface Props extends ButtonProps {
  RouterLink: React.ComponentType<any>;
}

export const ButtonLink = styled(({ RouterLink, ...otherProps }: Props) => (
  <Button
    as={(props: ButtonProps) => {
      const { variant, iconPosition, ...filteredProps } = props;
      return <RouterLink {...filteredProps} />;
    }}
    {...otherProps}
  />
))``;
