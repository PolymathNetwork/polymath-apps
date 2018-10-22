import React from 'react';
import { map } from 'lodash';
import { Loading } from 'carbon-components-react';
import WithSTOModules from '../../../../components/composers/WithSTOModules';
import STOTemplate from '../STOTemplate';

export default () => (
  <WithSTOModules
    render={({ data, loading }) => {
      if (loading) {
        return <Loading />;
      }

      return map(data, stoModule => {
        return <STOTemplate stoModule={stoModule} />;
      });
    }}
  />
);
