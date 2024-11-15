import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Inventory } from "../types";
import { APIHelper } from "../api";

interface AppState {
  inventory: Inventory;
  getInventory: () => void;
}

export const useAppState = create<AppState>()(
  devtools((set, get) => ({
    inventory: [],
    getInventory: () => {
      APIHelper.GetInventory().then((data) => {
        if (!data || data.error) {
          console.log(data);
          return;
        }

        set({ inventory: Array.isArray(data.data) ? data.data : [] });
      });
    },
  }))
);
