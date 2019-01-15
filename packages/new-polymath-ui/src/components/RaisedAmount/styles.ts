import { styled } from '~/styles';

export const Wrapper = styled.div`
  padding: 10px 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray[1]};
  min-width: 250px;
`;
