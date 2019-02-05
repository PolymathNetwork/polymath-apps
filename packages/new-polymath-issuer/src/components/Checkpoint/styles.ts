import { styled, ButtonLink } from '@polymathnetwork/new-ui';

export const NewDividendButton = styled(ButtonLink)`
  flex-direction: column;
  align-items: center;
`;

export const PlaceholderButton = styled(NewDividendButton).attrs({
  variant: 'ghost',
  iconPosition: 'top',
})`
  width: 300px;
  height: 370px;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.primary};
`;
