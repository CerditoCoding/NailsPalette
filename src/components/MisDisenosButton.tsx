"use client";

import Link from "next/link";
import Image from "next/image";

export function MisDisenosButton({ previewPhotos }: { previewPhotos: string[] }) {
  const hasPreview = previewPhotos.length > 0;

  return (
    <div className="group relative inline-block">
      <Link
        href="/mis-disenos"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
      >
        💅 Mis Diseños
      </Link>

      {hasPreview && (
        <div
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 flex -translate-x-1/2 gap-2 rounded-2xl border border-pink-100 bg-white p-2 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        >
          {previewPhotos.slice(0, 3).map((url, i) => (
            <div key={url + i} className="relative h-20 w-20 overflow-hidden rounded-xl">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
