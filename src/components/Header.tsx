"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Cómo pedir", href: "#como-pedir" },
  { label: "Contacto", href: "#contacto" },
];

export function Header() {
  const { totalCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#inicio" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-400 text-lg font-bold text-white shadow-sm">
            NP
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-zinc-900 sm:block">
            Nails Palette
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-zinc-700 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="uppercase transition-colors hover:text-pink-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 text-zinc-700 transition-colors hover:border-pink-400 hover:text-pink-500"
          aria-label="Abrir carrito"
        >
          <CartIcon />
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-semibold text-white">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.573-7.152.108-.459-.252-.898-.723-.898H5.25M7.5 14.25 5.106 5.272M6.75 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}
