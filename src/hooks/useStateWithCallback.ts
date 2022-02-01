import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

function useStateWithCallback<S>(
  initialState: S | (() => S),
): [S, (
    state: S | ((prev: S) => S),
    callback?: (state: S) => void,
    callbackPrev?: (prevState?: S) => void,
  ) => void] {
  const [internalState, setInternalState] = useState<S>(initialState);

  const statePrevRef = useRef<S>();
  const callbackPrevRef = useRef<(prevState?: S) => void>();
  const callbackRef = useRef<(state: S) => void>();

  const updateState = useCallback((
    state: S | ((prev: S) => S),
    callback?: (state: S) => void,
    callbackPrev?: (prevState?: S) => void,
  ) => {
    setInternalState(state);

    callbackRef.current = callback;
    callbackPrevRef.current = callbackPrev;
  }, []);

  useEffect(() => {
    callbackRef.current?.(internalState);
    callbackRef.current = undefined;

    callbackPrevRef.current?.(statePrevRef.current);
    callbackPrevRef.current = undefined;

    statePrevRef.current = internalState;
  }, [internalState]);

  return [internalState, updateState];
}

export default useStateWithCallback;
