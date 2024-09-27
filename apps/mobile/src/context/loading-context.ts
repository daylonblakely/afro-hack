import React from 'react';
import createDataContext from './create-data-context';

type LoadingState = { isLoading: boolean; message?: string };
type Actions = { type: string; payload: LoadingState };

const loadingReducer = (state: LoadingState, action: Actions) => {
  switch (action.type) {
    case 'set_loading':
      return action.payload;
    default:
      return state;
  }
};

const setIsLoading =
  (dispatch: React.Dispatch<Actions>) =>
  async (isLoading: boolean, message?: string) => {
    dispatch({ type: 'set_loading', payload: { isLoading, message } });
  };

export const {
  Provider,
  Context,
  useCustomContext: useLoadingContext,
} = createDataContext<LoadingState>(
  loadingReducer,
  { setIsLoading },
  { isLoading: false }
);
