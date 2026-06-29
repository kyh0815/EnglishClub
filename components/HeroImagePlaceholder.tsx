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
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const resolvedVideoSources = useMemo(
    () => (videoSources?.length ? videoSources : videoSrc ? [videoSrc] : []),
    [videoSrc, videoSources]
  );
  const currentVideoSrc = resolvedVideoSources[currentVideoIndex] ?? resolvedVideoSources[0];

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) {
        return;
      }

      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.playbackRate = videoPlaybackRate;
    });
  }, [videoPlaybackRate]);

  useEffect(() => {
    const activeVideo = videoRefs.current[currentVideoIndex];

    if (!activeVideo || !currentVideoSrc) {
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.playbackRate = videoPlaybackRate;

      if (index !== currentVideoIndex) {
        video.pause();
      }
    });

    activeVideo.currentTime = 0;
    activeVideo.muted = true;
    activeVideo.defaultMuted = true;
    activeVideo.volume = 0;
    activeVideo.playbackRate = videoPlaybackRate;
    void activeVideo.play().catch(() => undefined);
  }, [currentVideoIndex, currentVideoSrc, videoPlaybackRate]);

  const handleVideoEnded = (endedIndex: number) => {
    if (endedIndex !== currentVideoIndex) {
      return;
    }

    if (resolvedVideoSources.length <= 1) {
      setCurrentVideoIndex(0);
      return;
    }

    setCurrentVideoIndex((index) => (index + 1) % resolvedVideoSources.length);
  };

  return (
    <div className="hero-img" aria-label={label}>
      {currentVideoSrc ? (
        resolvedVideoSources.map((source, index) => (
          <video
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            className={`hero-video${index === currentVideoIndex ? " is-active" : ""}`}
            key={source}
            src={source}
            autoPlay={index === 0}
            muted
            loop={resolvedVideoSources.length <= 1}
            onEnded={() => handleVideoEnded(index)}
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ))
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
