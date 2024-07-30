import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MainStoreState {
  aboutLink: boolean;
  enableAboutLink: () => void;
}

const mainStore = create<MainStoreState>()(
  persist(
    // (set, get) => ({
    (set) => ({
      aboutLink: false,
      enableAboutLink: () =>
        set(() => {
          return {
            aboutLink: true,
          };
        }),
    }),
    {
      name: "6lueparr0t.github.io-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
    // {
    //   name: "6lueparr0t.github.io-storage",
    //   storage: createJSONStorage(() => sessionStorage),
    //   partialize: (state) =>
    //     Object.fromEntries(
    //       Object.entries(state as { [s: string]: unknown }).filter(
    //         ([key]) => !["key"].includes(key)
    //       )
    //     ),
    // }
  )
);

export default mainStore;
