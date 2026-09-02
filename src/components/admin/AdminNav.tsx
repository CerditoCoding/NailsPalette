"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Resumen", href: "/admin" },
  { label: "Etiquetas", href: "/admin/etiquetas" },
  { label: "Publicaciones", href: "/admin/publicaciones" },
  { label: "Vidriera", href: "/admin/vidriera" },
  { label: "Mis Diseños", href: "/admin/mis-disenos" },
  { label: "Pedidos", href: "/admin/pedidos" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
      {NAV_LINKS.map((link) => {
        // "/admin" es prefijo de todas las demás rutas del panel, así que
        // solo puede quedar activo por coincidencia exacta — si no, el tab
        // "Resumen" se marcaría activo en cualquier otra sección.
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-pink-400 text-white"
                : "text-zinc-600 hover:bg-pink-50 hover:text-pink-600"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
