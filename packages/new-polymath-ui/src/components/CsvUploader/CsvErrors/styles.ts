import { styled } from '~/styles';

export const Wrapper = styled.div`
  > * + * {
    margin-top: ${({ theme }) => theme.space.m};
  }
`;
