// @flow
import * as React from 'react';
import styled from 'styled-components';

import GroupError from '../FormItem/InputError';

const FormItemGroup = styled.div`
  padding-bottom: 1.3rem;
`;

FormItemGroup.Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -0.5rem;
`;

FormItemGroup.Error = GroupError; // This is just an alias

export default FormItemGroup;
