import React from 'react';
import { groupBy } from 'lodash';
import { types, formatters } from '@polymathnetwork/new-shared';
import { Grid, List, Button, Icon, icons } from '@polymathnetwork/new-ui';
import { Checkpoint } from '~/components/Checkpoint';
import * as sc from './styles';
import { iconSize } from './styles';

export interface Props {
  checkpoints: types.CheckpointEntity[];
  symbol: string;
}

export const Presenter = ({ checkpoints }: Props) => {
  const checkpointsByYear = groupBy(checkpoints, checkpoint =>
    checkpoint.createdAt.getFullYear()
  );

  return (
    <sc.Container alignItems="flex-start" vertical gridGap={7}>
      {Object.keys(checkpointsByYear).map(year => {
        const yearCheckpoints = checkpointsByYear[year];

        return (
          <sc.Checkpoints key={year}>
            <Grid gridAutoFlow="column" gridAutoColumns="200px 1fr">
              <Grid.Item gridColumn="2">
                <sc.Year>{year}</sc.Year>
              </Grid.Item>
            </Grid>
            <List vertical>
              {yearCheckpoints.map(checkpoint => {
                const isLastDividend =
                  yearCheckpoints.indexOf(checkpoint) ===
                    yearCheckpoints.length - 1 &&
                  Object.keys(checkpointsByYear).indexOf(year) !==
                    Object.keys(checkpointsByYear).length - 1;

                return (
                  <sc.YearCheckpoints key={checkpoint.index}>
                    <Grid gridAutoFlow="column" gridAutoColumns="200px 1fr">
                      <Grid.Item>
                        <Icon Asset={icons.SvgCalendar} />
                        {formatters.toDateFormat(checkpoint.createdAt)}
                        <br />
                        {formatters.toTimeFormat(checkpoint.createdAt)}
                        <Button kind="ghost">
                          Ownership list <Icon Asset={icons.SvgDownload} />
                        </Button>
                      </Grid.Item>
                      <Grid.Item>
                        <sc.Dividends isLastChild={isLastDividend}>
                          <sc.StepIcon
                            Asset={icons.SvgCheckmark}
                            width={iconSize}
                            height={iconSize}
                            scale={0.9}
                            color="primary"
                          />
                          <Checkpoint
                            checkpointIndex={checkpoint.index}
                            symbol="A0T0"
                          />
                        </sc.Dividends>
                      </Grid.Item>
                    </Grid>
                  </sc.YearCheckpoints>
                );
              })}
            </List>
          </sc.Checkpoints>
        );
      })}
    </sc.Container>
  );
};
