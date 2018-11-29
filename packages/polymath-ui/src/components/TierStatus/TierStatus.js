import React from 'react';
import { withTheme } from 'styled-components';

import Icon from '../Icon';

import ClockIcon from '../../images/icons/Clock';
import ProgressIcon from '../../images/icons/Progress';
import ChecklistIcon from '../../images/icons/Checklist';

const TierStatus = ({ status, theme, ...props }) =>
  ({
    'not-started': (
      <Icon Icon={ClockIcon} color={theme.colors.gray[3]} {...props} />
    ),
    active: (
      <Icon Icon={ProgressIcon} color={theme.colors.secondary} {...props} />
    ),
    done: (
      <Icon Icon={ChecklistIcon} color={theme.colors.green[0]} {...props} />
    ),
  }[status]);

export default withTheme(TierStatus);
