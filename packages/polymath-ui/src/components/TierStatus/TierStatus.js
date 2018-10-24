import React from 'react';
import styled from 'styled-components';

import Icon from '../Icon';

import theme from '../../theme';

import ClockIcon from '../../images/icons/Clock';
import ProgressIcon from '../../images/icons/Progress';
import ChecklistIcon from '../../images/icons/Checklist';

const TierStatus = ({ status }) =>
  ({
    'not-started': <Icon Icon={ClockIcon} color={theme.colors.gray[3]} />,
    'on-going': <Icon Icon={ProgressIcon} color={theme.colors.blue[0]} />,
    done: <Icon Icon={ChecklistIcon} color={theme.colors.green[0]} />,
  }[status]);

export default styled(TierStatus)`
  position: relative;
  top: -1px;
`;
