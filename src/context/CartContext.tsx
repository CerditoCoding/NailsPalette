"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  coverImage: string;
  price: number;
  size: string;
  quantity: number;
};

type AddableProduct = {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  price: number;
};

type CartContextValue = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: AddableProduct, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
  lines: CartLine[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nailspalette-cart";

function lineKey(productId: string, size: string) {
  return `${productId}::${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate cart from localStorage once on mount
        setLines(JSON.parse(stored));
      } catch {
        // ignore malformed cart data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addItem = (product: AddableProduct, size: string, quantity = 1) => {
    setLines((prev) => {
      const key = lineKey(product.id, size);
      const existing = prev.find((line) => lineKey(line.productId, line.size) === key);
      if (existing) {
        return prev.map((line) =>
          lineKey(line.productId, line.size) === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          coverImage: product.coverImage,
          price: product.price,
          size,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    const key = lineKey(productId, size);
    setLines((prev) => prev.filter((line) => lineKey(line.productId, line.size) !== key));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    const key = lineKey(productId, size);
    setLines((prev) =>
      prev.map((line) =>
        lineKey(line.productId, line.size) === key ? { ...line, quantity } : line
      )
    );
  };

  const clear = () => setLines([]);

  const totalCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

  const value: CartContextValue = {
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalCount,
    totalPrice,
    lines,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
