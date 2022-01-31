import classNames from 'classnames';
import { HTMLProps, useRef, useEffect } from 'react';

interface VideoProps extends HTMLProps<HTMLVideoElement> {
  stream: MediaStream;
}

function Video({ className, stream, ...props }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const { current: video } = videoRef;
    if (video) {
      video.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={classNames('video', className)}
      {...props}
    />
  );
}

export default Video;
