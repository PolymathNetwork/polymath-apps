import React, { Component, Fragment } from 'react';
import IndividualRestrictionsTable from './IndividualRestrictionsTable';

class IndividualRestrictions extends Component {
  render() {
    return (
      <Fragment>
        <h1 className="pui-h1">Individual Restrictions</h1>
        <h3 className="pui-h3">
          Specify restrictions by investor. Allows one 24h rolling period
          restriction and one custom rolling period restriction by investor.
          Each individual restriction will enforce a maximum number of tokens
          the specified investor can sell during the rolling period. Specify the
          token cap as either number of tokens or percentage of total token
          supply. These investors will be exempt from global restrictions.
        </h3>
        <IndividualRestrictionsTable />
      </Fragment>
    );
  }
}

export default IndividualRestrictions;
