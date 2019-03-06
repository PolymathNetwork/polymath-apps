import React, { FC } from 'react';
import styled from 'styled-components';
import { CardPrimary } from '~/components/CardPrimary';
import { Grid } from '~/components/Grid';
import { Text } from '~/components/Text';
import { Paragraph } from '~/components/Paragraph';
import * as sc from './styles';

export interface Props {}

const RemarkComponent: FC<Props> = ({ children }) => {
  return (
    <CardPrimary p={0}>
      <Grid
        gridAutoFlow="column"
        gridAutoColumns="auto 1fr"
        alignItems="center"
        gridGap={0}
      >
        <Text as="strong" p="gridGap" color="baseText">
          Note
        </Text>
        <sc.Content p="gridGap">
          <Paragraph color="baseText">{children}</Paragraph>
        </sc.Content>
      </Grid>
    </CardPrimary>
  );
};

export const Remark = styled(RemarkComponent)``;
