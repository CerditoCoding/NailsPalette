export function OrderConfirmationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-white to-pink-50 p-8 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-zinc-400 hover:bg-pink-100 hover:text-zinc-700"
          aria-label="Cerrar"
        >
          ×
        </button>

        <p className="text-5xl">💅✨</p>
        <h2 className="mt-4 text-lg font-bold text-zinc-900">¡Pedido confirmado!</h2>
        <p className="mt-2 text-sm text-zinc-600">
          En breve nos contactaremos con vos para coordinar el pago y el envío. 💕
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-pink-400 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-500"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
