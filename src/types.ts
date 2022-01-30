export interface ViewportContext {
  outcomingStream: MediaStream | null
  incomingStreams: MediaStream[]
}

export interface CallHistory {
  id: number
  start: number
  stop: number
}

export type StopCallCallback = (id?: string) => void;

export type StartCallCallback = StopCallCallback;

export interface P2PConnectionConfig {
  gotRemoteStream?: (stream: MediaStream) => void
}
