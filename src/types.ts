/* eslint-disable @typescript-eslint/no-redeclare */

export interface ViewportContext {
  outcomingStream: MediaStream | null
  incomingStream: MediaStream | null
}

export interface CallHistory {
  id: string
  start: number
  stop: number
  duration: number
}

export interface AppState {
  theme: Theme
  history: CallHistory[]
}

export const Theme = {
  Light: 'light' as const,
  Dark: 'dark' as const,
};

export type Theme = typeof Theme[keyof typeof Theme];

export type StopCallCallback = (id?: string) => void;

export type StartCallCallback = StopCallCallback;

export interface P2PConnectionConfig {
  gotRemoteStream?: (stream: MediaStream) => void
}
