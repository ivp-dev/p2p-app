import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Viewport, { ViewportContext } from './viewport';
import * as types from '../types';
import Connection from '../classes/p2p-connection';
import Client from '../classes/p2p-client';
import { useStateWithCallback } from '../hooks';
import { AppContext } from '../state/app-context';
import { addToHistoryActionCreator } from '../state/app-reducer';

function stopMediaStreamTracks(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function Player() {
  const [startOutcomingStream, setStartOutcomingStream] = useState(false);
  const [acceptIncomingStream, setAcceptIncomingStream] = useState(false);

  const [outcomingStream, setOutcomingStream] = useStateWithCallback<MediaStream | null>(null);
  const [incomingStream, setIncomingStream] = useStateWithCallback<MediaStream | null>(null);

  const [, setConnection] = useStateWithCallback<Connection | null>(null);

  const clientRef = useRef<Client | null>(null);

  const toggleOutcomeCallback = useCallback(() => setStartOutcomingStream(
    (current) => !current,
  ), []);

  const toggleIncomeCallback = useCallback(() => setAcceptIncomingStream(
    (current) => !current,
  ), []);

  const playerContextValue = useMemo<types.ViewportContext>(() => ({
    outcomingStream,
    incomingStream,
  }), [incomingStream, outcomingStream]);

  const { updateState } = useContext(AppContext);

  useEffect(() => {
    if (startOutcomingStream) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then((newOutcomingStream) => {
        setOutcomingStream(newOutcomingStream, (outcome) => {
          if (outcome) {
            clientRef.current = new Client(outcome);
          }
        }, stopMediaStreamTracks);
      });
    } else {
      setOutcomingStream(null, () => { }, (outcome) => {
        stopMediaStreamTracks(outcome);
        setAcceptIncomingStream(false);
      });
    }
  }, [setOutcomingStream, startOutcomingStream]);

  useEffect(() => {
    const { current: client } = clientRef;
    setConnection(
      acceptIncomingStream && client
        ? new Connection(client, {
          gotRemoteStream: (stream) => setIncomingStream(stream),
          onClose: () => { /* can write to state */ },
        })
        : null,
      (conn) => conn?.open(),
      (conn) => {
        setIncomingStream(null, () => { }, stopMediaStreamTracks);
        const history = conn?.disconect();
        history && updateState(addToHistoryActionCreator(history));
      },
    );
  }, [acceptIncomingStream, setConnection, setIncomingStream, updateState]);

  return (
    <div className="container">
      <ViewportContext.Provider value={playerContextValue}>
        <Viewport start={toggleOutcomeCallback} call={toggleIncomeCallback} />
      </ViewportContext.Provider>
    </div>
  );
}

export default Player;
