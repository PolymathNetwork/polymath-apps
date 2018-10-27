import React from 'react';

const SvgDai = props => (
  <svg
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <circle id="a" cx={12.5} cy={12.5} r={12.5} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <use fill="#FFEFC4" xlinkHref="#a" />
      <path
        d="M12.5 4.5l8 8-8 8-8-8 8-8zm-5.222 7.477h3.655l1.567-1.74 1.74 1.74h3.656L12.5 6.147l-5.222 5.83z"
        fill="#FEBE44"
        mask="url(#b)"
      />
    </g>
  </svg>
);

export default SvgDai;
