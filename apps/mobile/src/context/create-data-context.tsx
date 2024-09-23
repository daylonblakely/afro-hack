import React, { ReactNode, useReducer, useContext } from 'react';

type BoundAction = (...args: any) => Promise<void>;

type Actions = {
  [key in string]: (dispatch: React.Dispatch<any>) => BoundAction;
};

const createDataContext = <T,>(
  reducer: (state: T, action: any) => T,
  actions: Actions,
  defaultValue: T
) => {
  const Context = React.createContext<{
    state: T;
    actions: { [key in string]: BoundAction };
  }>({ state: defaultValue, actions: {} });

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: { [key in string]: BoundAction } = {};
    for (const key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, actions: { ...boundActions } }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider, useCustomContext: () => useContext(Context) };
};

export default createDataContext;
