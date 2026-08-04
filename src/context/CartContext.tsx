"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalCount: number;
  totalPrice: number;
  lines: { product: Product; quantity: number }[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nailspalette-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate cart from localStorage once on mount
        setItems(JSON.parse(stored));
      } catch {
        // ignore malformed cart data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter((line): line is { product: Product; quantity: number } => line !== null),
    [items]
  );

  const totalCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = lines.reduce(
    (sum, line) => sum + line.quantity * line.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        totalCount,
        totalPrice,
        lines,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
