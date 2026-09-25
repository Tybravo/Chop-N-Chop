"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SafeAvatarProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  timeoutMs?: number;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/avatar-placeholder.svg";
const DEFAULT_TIMEOUT = 5000; // 5 seconds - pravatar.cc can hang

/**
 * SafeAvatar wraps Next.js Image with a fallback mechanism.
 * If the remote image (e.g. i.pravatar.cc) fails to load, errors out,
 * or simply hangs/times out, it automatically swaps to a local placeholder.
 */
export function SafeAvatar({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
  unoptimized,
  timeoutMs = DEFAULT_TIMEOUT,
  fallbackSrc = DEFAULT_FALLBACK,
}: SafeAvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [prevSrc, setPrevSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  // Adjust state during render when the src prop changes (React recommended pattern)
  if (prevSrc !== src) {
    setPrevSrc(src);
    setCurrentSrc(src);
    setLoaded(false);
  }

  // Timeout detection: if the image hasn't loaded within timeoutMs,
  // swap to the local fallback placeholder.
  useEffect(() => {
    if (currentSrc === fallbackSrc || loaded) return;

    const timer = setTimeout(() => {
      setCurrentSrc(fallbackSrc);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [currentSrc, fallbackSrc, timeoutMs, loaded]);

  const handleError = () => {
    setCurrentSrc(fallbackSrc);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}