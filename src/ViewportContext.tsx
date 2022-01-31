import {
  createContext,
} from 'react';
import * as types from './types';

const ViewportContext = createContext<types.ViewportContext>({
  outcomingStream: null,
  incomingStream: null,
});

export default ViewportContext;
