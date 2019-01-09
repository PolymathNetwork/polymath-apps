// @flow
import * as React from 'react';
import styled from 'styled-components';

import FormItem from '../FormItem';
import GroupError from './GroupError';

const FormItemGroup = styled.div``;

FormItemGroup.Items = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${FormItem} {
    padding-bottom: 0;
    margin-right: 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

FormItemGroup.Error = GroupError;

export default FormItemGroup;
