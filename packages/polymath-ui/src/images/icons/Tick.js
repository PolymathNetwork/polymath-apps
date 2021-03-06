import React from 'react';

const SvgTick = props => (
  <svg width="1em" height="1em" {...props}>
    <g fillRule="evenodd" fill="currentColor">
      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0-2C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z" />
      <path d="M10 14l-2.6-2.6L6 12.8l4 4 7.5-7.4L16.1 8z" />
    </g>
  </svg>
);

export default SvgTick;
