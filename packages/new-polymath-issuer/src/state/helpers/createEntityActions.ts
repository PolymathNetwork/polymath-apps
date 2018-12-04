import { createStandardAction } from 'typesafe-actions';
import { Id } from '~/types';

export const createEntityActions = <T>(entityType: string) => {
  const createAction = createStandardAction(`${entityType}/CREATE`)<T>();
  const updateAction = createStandardAction(`${entityType}/UPDATE`)<T>();
  const deleteAction = createStandardAction(`${entityType}/DELETE`)<Id>();

  return {
    createAction,
    updateAction,
    deleteAction,
  };
};
