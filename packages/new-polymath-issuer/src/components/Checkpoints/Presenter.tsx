import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { ProgressIndicator } from '@polymathnetwork/new-ui';
import { Checkpoint } from '~/components/Checkpoint';

export interface Props {
  checkpoints: types.CheckpointEntity[];
  symbol: string;
}

export const Presenter = ({ checkpoints }: Props) => (
  <ProgressIndicator vertical>
    {checkpoints.map(checkpoint => (
      <ProgressIndicator.Step
        label={
          <Checkpoint
            key={checkpoint.index}
            checkpointIndex={checkpoint.index}
            symbol=""
          />
        }
      />
    ))}
  </ProgressIndicator>
);
