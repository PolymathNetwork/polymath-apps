import { Reducer } from 'redux';
import { Entity, PartialWithId } from '~/types';
import { PayloadAction } from 'typesafe-actions/dist/types';

export interface EntityState<T extends Entity> {
  byId: {
    [key: string]: T;
  };
  allIds: string[];
}

export const createEntityReducer = <T extends Entity>(entityType: string) => {
  const initialState: EntityState<T> = {
    byId: {},
    allIds: [],
  };

  const reducer: Reducer<EntityState<T>, PayloadAction<string, any>> = (
    state = initialState,
    action
  ): EntityState<T> => {
    switch (action.type) {
      case `${entityType}/CREATE`: {
        const typedAction = action as PayloadAction<string, T>;
        const {
          payload: { uid },
          payload,
        } = typedAction;
        const alreadyExists = !!state.byId[uid];

        if (alreadyExists) {
          return {
            ...state,
            byId: {
              ...state.byId,
              [uid]: { ...payload },
            },
          };
        }

        return {
          allIds: [...state.allIds, uid],
          byId: {
            ...state.byId,
            [uid]: { ...payload },
          },
        };
      }
      case `${entityType}/UPDATE`: {
        const typedAction = action as PayloadAction<string, PartialWithId<T>>;
        const { uid, ...updatedValues } = typedAction.payload;

        const entityToUpdate = state.byId[uid];

        if (!entityToUpdate) {
          throw new Error(
            `Update failed. There is no ${entityType} with id "${uid}" in the store.`
          );
        }

        const updatedEntity = {
          ...entityToUpdate,
          ...updatedValues,
        };

        return {
          ...state,
          byId: {
            ...state.byId,
            [uid]: updatedEntity,
          },
        };
      }
      case `${entityType}/DELETE`: {
        const typedAction = action as PayloadAction<string, string>;
        const uid = typedAction.payload;

        const {
          byId: { [uid]: removedElement, ...withElementRemoved },
        } = state;

        return {
          ...state,
          byId: { ...withElementRemoved },
        };
      }
      default: {
        return { ...state };
      }
    }
  };

  return reducer;
};
