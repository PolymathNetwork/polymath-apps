import { createStandardAction } from 'typesafe-actions';
import { PartialWithId } from '~/types';
import { types } from '@polymathnetwork/new-shared';

export const createEntityActions = <T extends types.Entity>(
  entityType: string
) => {
  const createAction = createStandardAction(`${entityType}/CREATE`)<T>();
  const updateAction = createStandardAction(`${entityType}/UPDATE`)<
    PartialWithId<T>
  >();
  const deleteAction = createStandardAction(`${entityType}/DELETE`)<string>();

  return {
    createAction,
    updateAction,
    deleteAction,
  };
};
