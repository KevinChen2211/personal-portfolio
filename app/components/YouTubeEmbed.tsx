"use client";

import Image from "next/image";
import { useState } from "react";

// Shows the video's thumbnail and only swaps in YouTube's player once it's
// clicked. Embedding the player directly pulled ~500 KiB of script and
// third-party cookies into every page with a video, which roughly halved
// those pages' mobile PageSpeed score.
export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-lg"
        style={{ border: "none" }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play video"
      className="group relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 800px) 100vw, 800px"
        className="object-cover"
      />
      <svg
        viewBox="0 0 68 48"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 w-[68px] h-[48px] -translate-x-1/2 -translate-y-1/2 opacity-90 transition-opacity group-hover:opacity-100"
      >
        <path
          d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3.3 34 .3 34 .3s-21.3 0-26.6 1.4c-2.9.8-5.1 3.1-5.9 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 5.9 6 5.3 1.4 26.6 1.4 26.6 1.4s21.3 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z"
          fill="#f00"
        />
        <path d="M45 24 27 14v20z" fill="#fff" />
      </svg>
    </button>
  );
}
