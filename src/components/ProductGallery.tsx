"use client";

import { useState } from "react";
import Image from "next/image";
import { emojiFromPlaceholder, gradientFor, isEmojiPlaceholder } from "@/lib/placeholderGradient";

function GalleryImage({
  url,
  seed,
  alt,
  className,
}: {
  url: string;
  seed: string;
  alt: string;
  className?: string;
}) {
  if (isEmojiPlaceholder(url)) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradientFor(seed)} ${className ?? ""}`}
      >
        <span className="text-6xl">{emojiFromPlaceholder(url)}</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image src={url} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

export function ProductGallery({
  productId,
  productName,
  images,
}: {
  productId: string;
  productName: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["emoji:💅"];

  return (
    <div>
      <GalleryImage
        url={gallery[active]}
        seed={`${productId}-${active}`}
        alt={gallery.length > 1 ? `${productName} — foto ${active + 1} de ${gallery.length}` : productName}
        className="aspect-square w-full rounded-2xl"
      />
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2">
          {gallery.map((url, index) => (
            <button
              key={url + index}
              type="button"
              onClick={() => setActive(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                active === index ? "border-pink-400" : "border-transparent"
              }`}
            >
              <GalleryImage
                url={url}
                seed={`${productId}-${index}`}
                alt={`Miniatura ${index + 1} de ${productName}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
