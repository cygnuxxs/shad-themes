import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImageUrlState {
  url: string;
  setUrl: (newUrl: string) => void;
}

interface ThemeState {
  themeCSS: string;
  setThemeCSS: (css: string) => void;
}

export const useImageStore = create<ImageUrlState>()(
  persist(
    (set) => ({
      url: "",
      setUrl: (newUrl: string) => {
        set({ url: newUrl });
      },
    }),
    {
      name: "image-store",
    }
  )
);

export const useThemeStore = create<ThemeState>()((set) => ({
  themeCSS: "",
  setThemeCSS: (css: string) => set({ themeCSS: css }),
}));
