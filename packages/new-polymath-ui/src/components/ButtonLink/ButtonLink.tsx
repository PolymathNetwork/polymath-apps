import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/Button';

export const ButtonLink = styled(({ RouterLink, ...otherProps }) => (
  <Button
    as={props => {
      const { variant, iconPosition, ...filteredProps } = props;
      return <RouterLink {...filteredProps} />;
    }}
    {...otherProps}
  />
))``;
