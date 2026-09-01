import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-black py-2 text-center text-xs font-medium tracking-wide text-white">
      💅 HACÉ CLIC{" "}
      <Link href="/#catalogo" className="underline hover:text-pink-300">
        ACÁ
      </Link>{" "}
      PARA ARMAR TU PEDIDO Y COORDINAR POR WHATSAPP
    </div>
  );
}
