import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import VideoPlayer from './Viewport';
import ViewportContext from './ViewportContext';
import * as types from './types';
import Connection from './P2PConnection';
import Client from './P2PClient';

import './App.scss';

function stopMediaStreamTracks(stream: MediaStream) {
  stream?.getTracks().forEach((track) => track.stop());
}

function App() {
  const [startOutcomingStream, setStartOutcomingStream] = useState(false);
  const [acceptIncomingStream, setAcceptIncomingStream] = useState(false);

  const [outcomingStream, setOutcomingStream] = useState<MediaStream | null>(null);
  const [incomingStream, setIncomingStream] = useState<MediaStream | null>(null);

  const [connection, setConnection] = useState<Connection | null>(null);

  const clientRef = useRef<Client | null>(null);

  const startCallback = useCallback(() => setStartOutcomingStream(true), []);

  const stopCallback = useCallback(() => setAcceptIncomingStream(false), []);
  const callCallback = useCallback(() => setAcceptIncomingStream(true), []);

  const playerContextValue = useMemo<types.ViewportContext>(() => ({
    outcomingStream,
    incomingStream,
  }), [incomingStream, outcomingStream]);

  useEffect(() => {
    if (startOutcomingStream) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then((newOutcomingStream) => {
        setOutcomingStream(newOutcomingStream);
      });
    } else {
      setOutcomingStream((stream) => {
        stream && stopMediaStreamTracks(stream);
        return null;
      });
    }
  }, [startOutcomingStream]);

  useEffect(() => {
    const { current: client } = clientRef;
    if (acceptIncomingStream && client) {
      setConnection(new Connection(client, {
        gotRemoteStream: (stream) => setIncomingStream(stream),
      }));
    } else {
      setIncomingStream((stream) => {
        stream && stopMediaStreamTracks(stream);
        return null;
      });

      setConnection((conn) => {
        conn?.close();
        return null;
      });
    }
  }, [acceptIncomingStream]);

  useEffect(() => {
    connection && connection.open();
  }, [connection]);

  useEffect(() => {
    if (outcomingStream) {
      clientRef.current = new Client(outcomingStream);
    }
  }, [outcomingStream]);

  return (
    <div className="container">
      <ViewportContext.Provider value={playerContextValue}>
        <VideoPlayer start={startCallback} stop={stopCallback} call={callCallback} />
      </ViewportContext.Provider>
    </div>
  );
}

export default App;
