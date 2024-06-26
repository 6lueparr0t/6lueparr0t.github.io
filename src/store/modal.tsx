import { create } from "zustand";
import type { Modal } from "@/components/components.d";

type Store = {
  modals: Modal[];
  clearModals: () => void;
  pushModals: (modal: Modal) => void;
  popModals: () => void;
};

const modalStore = create<Store>()((set) => ({
  modals: [],
  clearModals: () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set((_) => {
      return { modals: [] };
    });
  },
  pushModals: (modal: Modal) => {
    set((state) => {
      state.modals.push(modal);
      return { modals: [...state.modals] };
    });
  },
  popModals: () => {
    set((state) => {
      state.modals.pop();
      return { modals: [...state.modals] };
    });
  },
}));

export default modalStore;
