import React from 'react';

const SvgClock = props => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
    <path
      d="M8 1.333A6.674 6.674 0 0 1 14.667 8 6.674 6.674 0 0 1 8 14.667 6.674 6.674 0 0 1 1.333 8 6.674 6.674 0 0 1 8 1.333zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.899 8.306c.134.025.134.222 0 .248-1.271.24-4.03.74-4.364.74a.867.867 0 0 1-.868-.867c0-.341.514-3.631.75-4.963.023-.128.208-.12.229.01l.657 4.158 3.596.674z"
      fill="currentColor"
      fillRule="nonzero"
    />
  </svg>
);

export default SvgClock;
