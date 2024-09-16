import React from 'react';
import createDataContext from './create-data-context';
import server from '../api/server';
import { IUser } from '@afro-hack/types';

const userReducer = (state: IUser, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'set_user':
      return action.payload;
    default:
      return state;
  }
};

const fetchUser = (dispatch: React.Dispatch<any>) => async () => {
  try {
    const { data } = await server.get('/auth/currentUser');
    dispatch({ type: 'set_user', payload: data });
  } catch (error) {
    console.log(error);
  }
};

const createUser = (dispatch: React.Dispatch<any>) => async () => {
  try {
    //   const { data } = await server.post('/auth/user');
    const data: IUser = {
      name: '',
      email: '',
      googleId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'set_user', payload: data });
  } catch (error) {
    console.log(error);
  }
};

const signOut = (dispatch: React.Dispatch<any>) => () => {
  dispatch({ type: 'set_user', payload: null });
};

export const {
  Provider,
  Context,
  useCustomContext: useUserContext,
} = createDataContext(userReducer, { fetchUser, createUser, signOut }, null);
