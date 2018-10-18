// @flow

import * as React from 'react';

import metamask from '../../../images/metamask.png';

type Props = {|
  id: string,
  title: React.Node,
  description: React.Node,
|};

const GenericStatus = ({ id, title, description }: Props) => (
  <div id={id} className="pui-single-box-header">
    <div className="pui-single-box-metamask">
      <img src={metamask} alt="Metamask" />
    </div>
    <h1 className="pui-h1">{title}</h1>
    <h3 className="pui-h3">{description}</h3>
  </div>
);

export default GenericStatus;
