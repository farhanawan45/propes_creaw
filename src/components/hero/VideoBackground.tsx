"use client";

import { forwardRef } from "react";

interface VideoBackgroundProps {
  src: string;
  poster: string;
  muted: boolean;
  onError: () => void;
  className?: string;
}

const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  function VideoBackground({ src, poster, muted, onError, className = "" }, ref) {
    return (
      <video
        ref={ref}
        className={className}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="metadata"
        poster={poster}
        onError={onError}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }
);

export default VideoBackground;
