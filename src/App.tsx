import {
  useCallback,
  useEffect,
  useMemo,
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
  const [incomingStreams, setIncomingStreams] = useState<MediaStream[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [outcomingStream, setOutcomingStream] = useState<MediaStream | null>(null);
  const startCallback = useCallback(() => setStartOutcomingStream(true), []);
  const stopCallback = useCallback(() => setStartOutcomingStream(false), []);
  const callCallback = useCallback(() => {
    if (client) {
      const config: types.P2PConnectionConfig = {
        gotRemoteStream: (stream) => {
          setIncomingStreams(((incomes) => (incomes.some((income) => income === stream)
            ? incomes
            : [...incomes, stream]
          )));
        },
      };
      const conn = new Connection(client, config);
      setConnections((conns) => [...conns, conn]);
    }
  }, [client]);
  const playerContextValue = useMemo<types.ViewportContext>(() => ({
    outcomingStream,
    incomingStreams,
  }), [incomingStreams, outcomingStream]);
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
      setConnections((conns) => {
        conns.forEach((conn) => conn.close());
        return [];
      });
      setIncomingStreams((incomes) => {
        incomes.forEach(stopMediaStreamTracks);
        return [];
      });
    }
  }, [startOutcomingStream]);
  useEffect(() => {
    connections.forEach((conn) => {
      if (!conn.isOpened) {
        conn.open();
      }
    });
  }, [connections]);
  useEffect(() => {
    if (outcomingStream) {
      setClient(new Client(outcomingStream));
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
