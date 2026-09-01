import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      <FloatingWhatsapp />
      <ScrollToTopButton />
    </div>
  );
}
