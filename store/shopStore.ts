"use client"

import { create } from "zustand";

type ShopState = {
  sortBy: "featured" | "newest" | "price_asc" | "price_desc";
  inStockOnly: boolean;
  setSortBy: (value: ShopState["sortBy"]) => void;
  setInStockOnly: (value: boolean) => void;
};

export const useShopStore = create<ShopState>((set) => ({
  sortBy: "featured",
  inStockOnly: false,
  setSortBy: (sortBy) => set({ sortBy }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
}));
