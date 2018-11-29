import React from 'react';

const SvgProgress = props => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
    <g fillRule="nonzero" fill="none">
      <path
        d="M8 1.333A6.674 6.674 0 0 1 14.667 8 6.674 6.674 0 0 1 8 14.667 6.674 6.674 0 0 1 1.333 8 6.674 6.674 0 0 1 8 1.333zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"
        fill="currentColor"
      />
      <g stroke="currentColor" strokeWidth={1.2}>
        <path d="M4 11l2-2.5L9 8l3-3" />
        <path d="M9 5h3v3" />
      </g>
    </g>
  </svg>
);

export default SvgProgress;
