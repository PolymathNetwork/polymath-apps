import { createStandardAction } from 'typesafe-actions';
import { Entity, PartialWithId } from '~/types';

export const createEntityActions = <T extends Entity>(entityType: string) => {
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
