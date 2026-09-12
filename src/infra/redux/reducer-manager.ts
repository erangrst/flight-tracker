import { combineReducers, type Reducer, type UnknownAction, type ReducersMapObject } from '@reduxjs/toolkit';

export interface ReducerManager {
  getReducerMap(): ReducersMapObject;
  getReducer(): Reducer;
  add(name: string, reducer: Reducer): void;
  remove(name: string): void;
}

export function createReducerManager(initialReducers: ReducersMapObject = {}): ReducerManager {
  const reducers = { ...initialReducers };

  let combinedReducer = combineReducers(reducers);

  const keysToRemove: string[] = [];

  const reducerManager: ReducerManager = {
    getReducerMap: () => reducers,

    getReducer: () => combinedReducer,

    add: (name: string, reducer: Reducer) => {
      if (!name || reducers[name]) {
        return;
      }

      reducers[name] = reducer;
      combinedReducer = combineReducers(reducers);
    },

    remove: (name: string) => {
      if (!name || !reducers[name]) {
        return;
      }

      delete reducers[name];
      keysToRemove.push(name);

      combinedReducer = combineReducers(reducers);
    },
  };

  const reducer: Reducer = (state, action: UnknownAction) => {
    let nextState = state;

    if (keysToRemove.length > 0 && state) {
      nextState = { ...state };

      for (const key of keysToRemove) {
        delete nextState[key];
      }

      keysToRemove.length = 0;
    }

    return combinedReducer(nextState, action);
  };

  reducerManager.getReducer = () => reducer;

  return reducerManager;
}
