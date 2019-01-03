import React from 'react';
import styled from 'styled-components';

import { formError } from '../../../styles/utils';

const StyledError = styled.span`
  ${formError};
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
