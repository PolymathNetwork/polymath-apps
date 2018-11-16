import React from 'react';
import styled from 'styled-components';
import { uniq } from 'lodash';

import { formError } from '../../../styles/utils';

const StyledError = styled.span`
  ${formError};
  margin-top: 0.25rem;
  float: left;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

const GroupError = ({ name, errors, touched }) => {
  if (!touched[name] || !errors[name]) {
    return null;
  }

  const mergedErrors = Object.values(errors[name]).reduce((acc, error) => {
    return error !== 'Required.' ? acc.concat(error) : acc;
  }, []);

  return (
    <StyledError>
      {mergedErrors.length ? mergedErrors.join(' ') : 'Required.'}
    </StyledError>
  );
};

export default GroupError;
