import React from 'react';
import { Tooltip } from 'carbon-components-react';

import './style.scss';

type Props = {|
  label: string,
  title: string,
  content: string,
  direction: string,
|};

export default ({ label, title, content, direction = 'bottom' }: Props) => (
  <Tooltip
    triggerText={label}
    showIcon={false}
    triggerClassName="disabled-tooltip"
    direction={direction}
  >
    <p className="bx--tooltip__label">{title}</p>
    <p>{content}</p>
  </Tooltip>
);
