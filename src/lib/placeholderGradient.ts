const GRADIENTS = [
  "from-rose-200 via-rose-300 to-pink-400",
  "from-white via-pink-100 to-pink-300",
  "from-amber-200 via-yellow-300 to-pink-300",
  "from-rose-400 via-red-400 to-red-500",
  "from-pink-100 via-pink-200 to-fuchsia-300",
  "from-slate-200 via-slate-300 to-pink-200",
  "from-lime-200 via-pink-200 to-rose-300",
  "from-orange-200 via-pink-300 to-fuchsia-400",
  "from-stone-200 via-rose-200 to-pink-300",
];

export function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function isEmojiPlaceholder(url: string) {
  return url.startsWith("emoji:");
}

export function emojiFromPlaceholder(url: string) {
  return url.replace("emoji:", "");
}
