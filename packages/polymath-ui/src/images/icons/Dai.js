import React from 'react';

const SvgDai = props => (
  <svg width="1em" height="1em" {...props}>
    <defs>
      <circle id="dai_svg__a" cx={12.5} cy={12.5} r={12.5} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="dai_svg__b" fill="#fff">
        <use xlinkHref="#dai_svg__a" />
      </mask>
      <use fill="#FFEFC4" xlinkHref="#dai_svg__a" />
      <path
        d="M12.5 4.5l8 8-8 8-8-8 8-8zm-5.222 7.477h3.655l1.567-1.74 1.74 1.74h3.656L12.5 6.147l-5.222 5.83z"
        fill="#FEBE44"
        mask="url(#dai_svg__b)"
      />
    </g>
  </svg>
);

export default SvgDai;
