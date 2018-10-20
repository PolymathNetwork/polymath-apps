import React from 'react';
import { styled, InlineFlex, Flex } from 'reakit';
// TODO @grsmto: refactor this once we have a proper icon system
import iconClose from '../../../images/icons/close.svg';
import IconButton from '../../IconButton';

import theme from '../../../theme';

const Container = styled(InlineFlex)`
  background-color: ${theme.colors.blue[0]};
  border-radius: 50px;
  align-items: center;
  padding: 0 ${theme.space[1]}px;
`;

const LabelContainer = styled(Flex)`
  margin-left: -${theme.space[1]}px;
  margin-right: ${theme.space[2]}px;
`;

const StyledIconButton = styled(IconButton)`
  background-color: ${theme.colors.gray[2]};
  box-sizing: border-box;
  padding: 3px;
  height: 16px;
  width: 16px;
  border-radius: 10px;
`;

const SelectValue = ({ label, onRemove }) => (
  <Container>
    <LabelContainer>{label}</LabelContainer>
    <StyledIconButton icon={iconClose} onClick={onRemove} />
  </Container>
);

export default SelectValue;
