import React from 'react';
import styled from 'styled-components';

import { Box } from '~/components/Box';
import { IconButton } from '~/components/IconButton';

import { SvgClose } from '~/images/icons/Close';

const Wrapper = styled(Box)`
  display: inline-flex;
  background-color: ${({ theme }) => theme.inputs.backgroundColor};
  border-radius: 50px;
  vertical-align: top;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[1]};
  margin-right: ${({ theme }) => theme.space[2]};
  margin-top: 7px;
`;

const LabelWrapper = styled(Box)`
  display: flex;
  margin-left: -${({ theme }) => theme.space[1]};
  margin-right: ${({ theme }) => theme.space[3]};
`;

const StyledIconButton = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.gray[2]};
  color: ${({ theme }) => theme.inputs.backgroundColor};
  box-sizing: border-box;
  padding: 4px;
  height: 15px;
  width: 15px;
  border-radius: 10px;

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
`;

export class Value extends React.Component {
  onRemove = () => {
    this.props.onRemove(this.props.value);
  };

  render() {
    return (
      <Wrapper>
        <LabelWrapper>{this.props.label}</LabelWrapper>
        <StyledIconButton Asset={SvgClose} onClick={this.onRemove} />
      </Wrapper>
    );
  }
}
