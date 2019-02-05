import { styled } from '~/styles';

import { PageWrap } from '../PageWrap';

export const Wrapper = styled(PageWrap)`
  min-height: calc(
    100vh -
      (${({ theme }) => `${theme.header.height} + ${theme.footer.height}`})
  );
`;
