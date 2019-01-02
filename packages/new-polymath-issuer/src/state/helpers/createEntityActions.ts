import { createStandardAction } from 'typesafe-actions';

export const createEntityActions = <T>(entityType: string) => {
  const createAction = createStandardAction(`${entityType}/CREATE`)<T>();
  const updateAction = createStandardAction(`${entityType}/UPDATE`)<T>();
  const deleteAction = createStandardAction(`${entityType}/DELETE`)<string>();

  return {
    createAction,
    updateAction,
    deleteAction,
  };
};
