import * as React from 'react';
export const SvgPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 12 12" {...props}>
    <path
      d="M7 0H5v5H0v2h5v5h2V7h5V5H7z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);
