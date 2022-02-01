import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { AppState, CallHistory, Theme } from '../types';

export interface Action<T> {
  type: T;
}

export interface ActionWithPayload<T, P> extends Action<T> {
  payload: P;
}

export const initialState: AppState = {
  theme: Theme.Dark,
  history: [],
};

export const initializer = (initialValue: AppState) => {
  const persistState = localStorage.getItem('state');
  if (persistState) {
    return JSON.parse(persistState) as AppState;
  }
  return initialValue;
};

export const appReducer = (state: AppState, action: Actions) => {
  switch (action.type) {
    case ADD_TO_HISTORY: {
      return { ...state, history: [...state.history, action.payload.call] };
    }
    case REMOVE_FROM_HISTORY: {
      return {
        ...state,
        history: state.history.filter(
          (call) => call.id !== action.payload.callId,
        ),
      };
    }
    case SET_THEME: {
      return { ...state, theme: action.payload.theme };
    }
    default: {
      return state;
    }
  }
};

export const addToHistoryActionCreator = (
  call: CallHistory,
): ActionWithPayload<typeof ADD_TO_HISTORY, { call: CallHistory }> => ({
  type: ADD_TO_HISTORY,
  payload: {
    call,
  },
});

export const removeFronHistoryActionCreator = (
  callId: string,
): ActionWithPayload<typeof REMOVE_FROM_HISTORY, { callId: string }> => ({
  type: REMOVE_FROM_HISTORY,
  payload: {
    callId,
  },
});

export const setThemeActionCreator = (
  theme: Theme,
): ActionWithPayload<typeof SET_THEME, { theme: Theme }> => ({
  type: SET_THEME,
  payload: {
    theme,
  },
});

export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';

export const REMOVE_FROM_HISTORY = 'REMOVE_FROM_HISTORY';

export const SET_THEME = 'SET_THEME';

export type Actions =
  | { type: typeof ADD_TO_HISTORY; payload: { call: CallHistory } }
  | { type: typeof REMOVE_FROM_HISTORY; payload: { callId: string } }
  | { type: typeof SET_THEME; payload: { theme: Theme } };
