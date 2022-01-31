import {
  createContext,
  PropsWithChildren,
  useEffect,
  useReducer,
  Dispatch,
  useMemo,
} from 'react';
import {
  appReducer,
  initializer,
  Actions,
  initialState,
} from './app-reducer';
import { AppState } from '../types';

export const AppContext = createContext<{
  state: AppState,
  updateState: Dispatch<Actions>
}>({
  state: initialState,
  updateState: () => {},
});

export default function AppContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const [state, updateState] = useReducer(
    appReducer,
    initialState,
    initializer,
  );

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  const contextValue = useMemo(
    () => ({
      state,
      updateState,
    }),
    [state],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
