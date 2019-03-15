import styled from 'styled-components';
import { Icon } from '~/components/Icon';

export const Input = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  visibility: visible;
  white-space: nowrap;
`;

export const CheckIcon = styled(Icon)`
  display: block;
  transition: ${({ theme }) => theme.transitions.hover.ms}ms;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  margin: auto;
`;

export const CheckboxInput = styled.label`
  display: block;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.hover.ms}ms;
  cursor: pointer;
  box-sizing: border-box;
  border: 2px solid ${({ theme }) => theme.colors.gray[3]};
  width: 1.125rem;
  height: 1.125rem;
  background-color: #fff;
  user-select: none;

  ${Input}:focus + & {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  ${Input}:checked:focus + & {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  ${Input}:checked + & ${CheckIcon} {
    visibility: visible;
    opacity: 1;
  }
`;
