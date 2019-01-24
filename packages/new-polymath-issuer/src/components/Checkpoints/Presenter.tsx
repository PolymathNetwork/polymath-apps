import React from 'react';
import { groupBy } from 'lodash';
import { types } from '@polymathnetwork/new-shared';
import {
  Grid,
  List,
  Heading,
  IconOutlined,
  icons,
} from '@polymathnetwork/new-ui';
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
    <sc.Container alignItems="flex-start" vertical>
      {Object.keys(checkpointsByYear).map(year => {
        const yearCheckpoints = checkpointsByYear[year];

        return (
          <sc.Checkpoints key={year}>
            <Grid gridAutoFlow="column" gridAutoColumns="200px 1fr">
              <Grid.Item gridColumn="2">
                <Heading mt={-6}>{year}</Heading>
              </Grid.Item>
            </Grid>
            <List vertical>
              {yearCheckpoints.map(checkpoint => (
                <li key={checkpoint.index}>
                  <Grid gridAutoFlow="column" gridAutoColumns="200px 1fr">
                    <Grid.Item>{checkpoint.createdAt.getDate()}</Grid.Item>
                    <Grid.Item>
                      <sc.Dividends
                        pb={
                          yearCheckpoints.indexOf(checkpoint) ===
                            yearCheckpoints.length - 1 &&
                          Object.keys(checkpointsByYear).indexOf(year) !==
                            Object.keys(checkpointsByYear).length - 1
                            ? 'xl'
                            : 0
                        }
                      >
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
                </li>
              ))}
            </List>
          </sc.Checkpoints>
        );
      })}
    </sc.Container>
  );
};
