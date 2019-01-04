import * as React from 'react';
export const SvgDai = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle fill="#FFEFC4" cx={12.5} cy={12.5} r={12.5} />
      <path
        d="M12.5 4.5l8 8-8 8-8-8 8-8zm-5.222 7.477h3.655l1.567-1.74 1.74 1.74h3.656L12.5 6.147l-5.222 5.83z"
        fill="#FEBE44"
        mask="url(#dai_svg__b)"
      />
    </g>
  </svg>
);
