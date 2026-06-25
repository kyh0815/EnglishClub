"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type HeroImagePlaceholderProps = {
  label: string;
  src?: string;
  videoSrc?: string;
  videoSources?: readonly string[];
  videoPlaybackRate?: number;
};

export default function HeroImagePlaceholder({
  label,
  src,
  videoSrc,
  videoSources,
  videoPlaybackRate = 1
}: HeroImagePlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const resolvedVideoSources = useMemo(
    () => (videoSources?.length ? videoSources : videoSrc ? [videoSrc] : []),
    [videoSrc, videoSources]
  );
  const currentVideoSrc = resolvedVideoSources[currentVideoIndex] ?? resolvedVideoSources[0];

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.playbackRate = videoPlaybackRate;
    }
  }, [videoPlaybackRate]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !currentVideoSrc) {
      return;
    }

    video.playbackRate = videoPlaybackRate;
    video.load();
    void video.play();
  }, [currentVideoSrc, videoPlaybackRate]);

  const handleVideoEnded = () => {
    if (resolvedVideoSources.length <= 1) {
      setCurrentVideoIndex(0);
      return;
    }

    setCurrentVideoIndex((index) => (index + 1) % resolvedVideoSources.length);
  };

  return (
    <div className="hero-img" aria-label={label}>
      {currentVideoSrc ? (
        <video
          ref={videoRef}
          className="hero-video"
          src={currentVideoSrc}
          autoPlay
          muted
          loop={resolvedVideoSources.length <= 1}
          onEnded={handleVideoEnded}
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      ) : src ? (
        <Image
          src={src}
          alt={label}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="hero-photo"
        />
      ) : null}
      {src || currentVideoSrc ? null : (
        <div className="ph-c">
          <span className="sr-only">{label}</span>
        </div>
      )}
    </div>
  );
}
