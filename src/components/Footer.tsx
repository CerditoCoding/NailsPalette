export function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Nails Palette. Todos los derechos reservados.
      </div>
    </footer>
  );
}
