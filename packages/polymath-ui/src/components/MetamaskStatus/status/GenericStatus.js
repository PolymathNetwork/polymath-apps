// @flow

import React from 'react';

import metamask from '../../../images/metamask.png';

import Heading from '../../Heading';

type Props = {|
  id: string,
  title: string,
  description: string,
|};

const GenericStatus = ({ id, title, description }: Props) => (
  <div id={id} className="pui-single-box-header">
    <div className="pui-single-box-metamask">
      <img src={metamask} alt="Metamask" />
    </div>

    <Heading variant="h1" mr={190}>
      {title}
    </Heading>
    <Heading variant="h4" mr={190}>
      {description}
    </Heading>
  </div>
);

export default GenericStatus;
