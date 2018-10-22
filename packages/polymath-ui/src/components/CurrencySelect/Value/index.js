import React from 'react';
import styled from 'styled-components';

import SvgClose from '../../../images/icons/Close';
import Box from '../../Box';
import IconButton from '../../IconButton';

import theme from '../../../theme';

const Container = styled(Box)`
  display: inline-flex;
  background-color: ${theme.colors.gray[0]};
  border-radius: 50px;
  vertical-align: middle;
  align-items: center;
  padding: 0 ${theme.space[1]}px;
  & + & {
    margin-left: ${theme.space[2]}px;
  }
`;

const LabelContainer = styled(Box)`
  display: flex;
  margin-left: -${theme.space[1]}px;
  margin-right: ${theme.space[2]}px;
`;

const StyledIconButton = styled(IconButton)`
  background-color: ${theme.colors.gray[1]};
  color: ${theme.colors.gray[0]};
  box-sizing: border-box;
  padding: 5px;
  height: 16px;
  width: 16px;
  border-radius: 10px;
`;

export default class Value extends React.Component {
  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.value);
  }

  render() {
    return (
      <Container>
        <LabelContainer>{this.props.label}</LabelContainer>
        <StyledIconButton Icon={SvgClose} onClick={this.onRemove} />
      </Container>
    );
  }
}
