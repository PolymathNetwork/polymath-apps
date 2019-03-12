import React from 'react';
import { groupBy } from 'lodash';
import { types, formatters } from '@polymathnetwork/new-shared';
import {
  Grid,
  List,
  Button,
  Paragraph,
  Icon,
  icons,
  IconText,
} from '@polymathnetwork/new-ui';
import { DividendList } from '~/components/DividendList';
import * as sc from './styles';
import { iconSize } from './styles';

export interface Props {
  checkpoints: types.CheckpointEntity[];
  securityTokenSymbol: string;
  downloadOwnershipList: (checkpoint: types.CheckpointEntity) => void;
  filterDividends: string;
}

export const CheckpointListPresenter = ({
  checkpoints,
  securityTokenSymbol,
  downloadOwnershipList,
  filterDividends,
}: Props) => {
  const checkpointsByYear = groupBy(checkpoints, checkpoint =>
    checkpoint.createdAt.getFullYear()
  );

  console.log(filterDividends);

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
                      <Grid.Item pr="gridGap">
                        <Paragraph fontSize={1} textAlign="right">
                          <IconText>
                            <Icon Asset={icons.SvgCalendar} color="secondary" />{' '}
                            <span>
                              {formatters.toDateFormat(checkpoint.createdAt)}
                            </span>
                          </IconText>
                          <br />
                          {formatters.toTimeFormat(checkpoint.createdAt)}
                        </Paragraph>
                        <Paragraph color="primary" textAlign="right">
                          <Button
                            variant="ghostSecondary"
                            iconPosition="right"
                            onClick={() => downloadOwnershipList(checkpoint)}
                          >
                            Ownership list <Icon Asset={icons.SvgDownload} />
                          </Button>
                        </Paragraph>
                      </Grid.Item>
                      <Grid.Item>
                        <sc.Dividends>
                          <sc.ProgressIndicator isLastChild={isLastDividend}>
                            <sc.StepIcon
                              Asset={icons.SvgCheckmark}
                              width={iconSize}
                              height={iconSize}
                              scale={0.8}
                              color="primary"
                            />
                          </sc.ProgressIndicator>
                          <DividendList
                            checkpointIndex={checkpoint.index}
                            securityTokenSymbol={securityTokenSymbol}
                            filterNameBy={filterDividends}
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
