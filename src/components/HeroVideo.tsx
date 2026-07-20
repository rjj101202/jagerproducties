"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Achtergrondvideo met poster-fallback.
 * - Server rendert alléén de poster (geen hydration-verschil in beeld).
 * - Video wordt pas na mount toegevoegd, en alleen als de bezoeker
 *   geen reduced motion heeft ingesteld.
 * - De video fadet pas in zodra hij daadwerkelijk speelt; tot die tijd
 *   blijft de poster zichtbaar (ook in omgevingen zonder autoplay).
 */
export default function HeroVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOk(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMotionOk(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {motionOk && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setPlaying(true)}
          onEnded={() => {
            // Fallback: sommige browsers negeren `loop` bij autoplay.
            const v = videoRef.current;
            if (v) {
              v.currentTime = 0;
              void v.play();
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
