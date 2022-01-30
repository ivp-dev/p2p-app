import {
  createContext,
  PropsWithChildren,
  useEffect,
  useReducer,
  Dispatch,
  useMemo,
} from 'react';
import { historyReducer, initializer, Actions } from './historyReducer';
import * as types from './types';

const HistoryContext = createContext<{
  history: types.CallHistory[],
  updateHistory: Dispatch<Actions>
}>({
  history: [],
  updateHistory: (value: Actions) => { },
});

export default function HistoryContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const [history, updateHistory] = useReducer(historyReducer, [], initializer);

  useEffect(() => {
    localStorage.setItem('callHistory', JSON.stringify(history));
  }, [history]);

  const contextValue = useMemo(() => ({
    history,
    updateHistory,
  }), [history]);

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}
