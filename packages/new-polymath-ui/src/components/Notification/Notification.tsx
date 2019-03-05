import React, { FC } from 'react';
import { Text } from '~/components/Text';
import { Paragraph } from '~/components/Paragraph';
import { Flex } from '~/components/Flex';
import { Box } from '~/components/Box';
import * as sc from './styles';
import { Icon } from '~/components/Icon';
import { SvgInfo } from '~/images/icons';
import { SvgWarning } from '~/images/icons';
import { SvgAlert } from '~/images/icons';

interface Props {
  status: 'idle' | 'warning' | 'alert';
  title: string;
  description: string;
}

const getStatusIcon = (status: Props['status']) =>
  ({
    idle: SvgInfo,
    warning: SvgWarning,
    alert: SvgAlert,
  }[status]);

export const Notification: FC<Props> = ({ status, title, description }) => {
  return (
    <sc.Wrapper status={status}>
      <Flex flex="0">
        <Icon
          Asset={getStatusIcon(status)}
          width={20}
          height={20}
          color={status}
        />
      </Flex>
      <Box ml="s">
        <Text as="strong">{title}</Text>
        <Paragraph color="baseText">{description}</Paragraph>
      </Box>
    </sc.Wrapper>
  );
};

Notification.defaultProps = {
  status: 'idle',
};
