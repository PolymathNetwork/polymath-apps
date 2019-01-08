import styled from '~/styles';

export const Wrapper = styled.span`
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;

  &:before {
    float: right;
    content: attr(data-tail);
  }
`;
