"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_DURATION_MS = 4000;

/** Distancia circular con signo más corta entre dos índices (ej. con n=5,
 * de 4 a 0 la distancia es +1, no -4), para que las fotos lejos del centro
 * salten mientras están invisibles y no mientras se ven. */
function circularDelta(index: number, current: number, total: number) {
  let delta = (index - current) % total;
  if (delta > total / 2) delta -= total;
  if (delta < -total / 2) delta += total;
  return delta;
}

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
        <h2 className="mb-6 text-center text-xl font-bold text-zinc-900">Diseños para vos</h2>

        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
          {photos.map((url, i) => {
            const delta = circularDelta(i, index, photos.length);
            const isCenter = delta === 0;
            const isNeighbor = Math.abs(delta) === 1;
            const visible = isCenter || isNeighbor;

            return (
              <div
                key={url + i}
                aria-hidden={!isCenter}
                className={`absolute left-1/2 top-1/2 h-full w-[72%] rounded-2xl transition-all duration-700 ease-in-out sm:w-[55%] ${
                  isCenter
                    ? "z-20 opacity-100 blur-none brightness-100"
                    : isNeighbor
                      ? "z-10 opacity-45 blur-[3px] brightness-60"
                      : "z-0 opacity-0"
                }`}
                style={{
                  transform: `translate(calc(-50% + ${delta * 68}%), -50%) scale(${
                    isCenter ? 1 : visible ? 0.87 : 0.8
                  })`,
                }}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 72vw, 55vw"
                  className="rounded-2xl object-cover shadow-lg"
                  priority={isCenter}
                />
              </div>
            );
          })}
        </div>

        {photos.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {photos.map((url, i) => (
              <button
                key={url + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-pink-400" : "w-1.5 bg-pink-200 hover:bg-pink-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
