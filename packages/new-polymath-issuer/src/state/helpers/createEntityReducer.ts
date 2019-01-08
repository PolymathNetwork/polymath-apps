import { Reducer } from 'redux';

export interface EntityState<T> {
  byId: {
    [key: string]: T;
  };
  allIds: string[];
}

export const createEntityReducer = <T>(entityType: string) => {
  const initialState: EntityState<T> = {
    byId: {},
    allIds: [],
  };

  const reducer: Reducer<EntityState<T>> = (
    state = initialState,
    action
  ): EntityState<T> => {
    switch (action.type) {
      case `${entityType}/CREATE`: {
        const {
          payload: { id },
          payload,
        } = action;
        const alreadyExists = !!state.byId[id];

        if (alreadyExists) {
          return {
            ...state,
            byId: {
              ...state.byId,
              [id]: payload,
            },
          };
        }

        return {
          allIds: [...state.allIds, id],
          byId: {
            ...state.byId,
            [id]: payload,
          },
        };
      }
      default: {
        return { ...state };
      }
    }
  };

  return reducer;
};
