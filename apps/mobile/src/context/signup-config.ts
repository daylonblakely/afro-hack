import React from 'react';
import createDataContext from './create-data-context';
import server from '../api/server'; // Replace this with your API setup
import { ISignupFlowConfig } from '@afro-hack/types';

type SignupFlowConfigState = ISignupFlowConfig[];
type Actions = { type: 'fetch_config'; payload: SignupFlowConfigState };

const signupFlowConfigReducer = (
  state: SignupFlowConfigState,
  action: Actions
) => {
  switch (action.type) {
    case 'fetch_config':
      return action.payload;
    default:
      return state;
  }
};

// Action to fetch SignupFlowConfig from the API
const fetchSignupFlowConfig =
  (dispatch: React.Dispatch<Actions>) => async () => {
    try {
      const { data } = await server.get('/config/signupFlow');
      dispatch({ type: 'fetch_config', payload: data });
    } catch (error) {
      console.error('Error fetching signup flow config:', error);
    }
  };

// Export the context, provider, and custom hook
export const {
  Provider,
  Context,
  useCustomContext: useSignupFlowConfigContext,
} = createDataContext(signupFlowConfigReducer, { fetchSignupFlowConfig }, []);
