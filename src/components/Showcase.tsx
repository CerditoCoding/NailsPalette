"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_DURATION_MS = 4500;

export function Showcase({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <section className="bg-pink-50/40 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold text-zinc-900">Nuestra vidriera</h2>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm sm:aspect-[21/9]">
          {photos.map((url, i) => (
            <div
              key={url + i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                i === index
                  ? "translate-x-0 opacity-100"
                  : i < index
                    ? "-translate-x-6 opacity-0"
                    : "translate-x-6 opacity-0"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          {photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
