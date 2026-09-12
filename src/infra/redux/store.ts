import { configureStore, Reducer } from '@reduxjs/toolkit';
import { createReducerManager } from './reducer-manager';

export const reducerManager = createReducerManager();

export const store = configureStore({
  reducer: reducerManager.getReducer(),
});

export function addSlice(name: string, reducer: Reducer): void {
  reducerManager.add(name, reducer);
  store.replaceReducer(reducerManager.getReducer());
}

export function removeSlice(name: string): void {
  reducerManager.remove(name);
  store.replaceReducer(reducerManager.getReducer());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
