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

  const reducer: Reducer<EntityState<T>> = (state = initialState, action) => {
    switch (action.type) {
      case `${entityType}/CREATE`: {
        const { id } = action.payload;
        const alreadyExists = !!state.byId[id];

        if (alreadyExists) {
          throw new Error(
            `An entity of type "${action.type}" and id "${id}" already exists.`
          );
        }

        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: action.payload,
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
