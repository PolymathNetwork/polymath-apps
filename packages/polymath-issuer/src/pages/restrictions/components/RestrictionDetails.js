import React, { Component, Fragment } from 'react';
import { icons, Icon } from '@polymathnetwork/new-ui';
import { Grid } from '@polymathnetwork/ui';

class RestrictionDetails extends Component {
  render() {
    const { restriction } = this.props;
    return (
      <Fragment>
        <Grid gridGap="12px">
          <Grid.Row>
            <Grid.Col gridSpan={12}>
              <Icon Asset={icons.SvgCalendar} />
              {restriction.startTime.format('MMMM Do YYYY, h:mm:ss a')}
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col gridSpan={12}>
              <Icon Asset={icons.SvgCalendar} />
              {restriction.endTime.format('MMMM Do YYYY, h:mm:ss a')}
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col gridSpan={12}>
              A maximum of{' '}
              {restriction.restrictionType === 1
                ? `${restriction.allowedTokens * 100}%`
                : restriction.allowedTokens}{' '}
              tokens can be sold by each investor per rolling period
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

export default RestrictionDetails;
