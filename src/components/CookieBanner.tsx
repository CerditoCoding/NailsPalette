"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nailspalette-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reveal banner once on mount if no prior consent
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pink-100 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-zinc-600">
          Al navegar por este sitio <strong>aceptás el uso de cookies</strong> para
          mejorar tu experiencia.
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
          }}
          className="shrink-0 rounded-full bg-pink-400 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-500"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
