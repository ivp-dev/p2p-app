import { CallHistory } from './types';

const initialState: CallHistory[] = [];

export const initializer = (initialValue = initialState) => {
  const persistState = localStorage.getItem('callHistory');
  if (persistState) {
    return JSON.parse(persistState) as CallHistory[];
  }
  return initialValue;
};

export const historyReducer = (state: CallHistory[], action: Actions) => {
  switch (action.type) {
    case ADD_TO_HISTORY: {
      return [...state, action.payload.call];
    }
    case REMOVE_FROM_HISTORY: {
      return state.filter((call) => call.id === action.payload.callId);
    }
    default: {
      return state;
    }
  }
};

export const addToHistoryActionCreator = (call: CallHistory) => ({
  type: ADD_TO_HISTORY,
  payload: {
    call,
  },
});

export const removeFronHistoryActionCreator = (callId: number) => ({
  type: REMOVE_FROM_HISTORY,
  payload: {
    callId,
  },
});

export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';

export const REMOVE_FROM_HISTORY = 'REMOVE_FROM_HISTORY';

export type Actions =
  | { type: typeof ADD_TO_HISTORY, payload: { call: CallHistory } }
  | { type: typeof REMOVE_FROM_HISTORY, payload: { callId: number } };
