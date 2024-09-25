import React from 'react';
import createDataContext from './create-data-context';
import { IPrompt } from '@afro-hack/types';
import server from '../api/server';

type FlashCardState = IPrompt[];
type Actions = { type: string; payload: FlashCardState };

const flashCardReducer = (state: FlashCardState, action: Actions) => {
  switch (action.type) {
    case 'set_flash_cards':
      return action.payload;
    default:
      return state;
  }
};

const getFlashCards =
  (dispatch: React.Dispatch<Actions>) => async (callback: () => void) => {
    try {
      const { data } = await server.get('/prompt/latest');
      dispatch({ type: 'set_flash_cards', payload: data });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.log('error getting cards');
    }
  };

export const {
  Provider,
  Context,
  useCustomContext: useFlashCardContext,
} = createDataContext<FlashCardState>(flashCardReducer, { getFlashCards }, []);
