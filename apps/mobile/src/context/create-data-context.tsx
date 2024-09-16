import React, { ReactNode, useReducer, useContext } from 'react';

export default (reducer: any, actions: any, defaultValue: any) => {
  const Context = React.createContext(defaultValue);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: Partial<typeof actions> = {};
    for (const key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider, useCustomContext: () => useContext(Context) };
};
