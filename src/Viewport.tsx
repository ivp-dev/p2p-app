import classNames from 'classnames';
import {
  HTMLProps,
  useContext,
  useEffect,
  useRef,
} from 'react';
import ViewportContext from './ViewportContext';

interface ViewportProps {
  stop: () => void
  start: () => void
  call: () => void
}

function Viewport({ start, stop, call }: ViewportProps) {
  const {
    outcomingStream,
    incomingStream,
  } = useContext(ViewportContext);
  return (
    <div className="viewport">
      {outcomingStream && <Player stream={outcomingStream} autoPlay className="full-size" />}
      <div className="incomes__container">
        {incomingStream && <Player stream={incomingStream} autoPlay className="full-size br-1" />}
      </div>
      <div className="control-pane">
        <button type="button" onClick={() => start()}>start</button>
        <button type="button" onClick={() => call()}>call</button>
        <button type="button" onClick={() => stop()}>stop</button>
      </div>
    </div>
  );
}

interface PlayerProps extends HTMLProps<HTMLVideoElement> {
  stream: MediaStream
}

function Player({
  className,
  stream,
  ...props
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const { current: video } = videoRef;
    if (video) {
      video.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} className={classNames('player', className)} {...props} />;
}

export default Viewport;
