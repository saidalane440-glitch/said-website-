import { create } from "zustand";

export type FileCategory = "video" | "document" | "image" | "other";

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  uploadDate: number;
  url: string;
}

interface AppState {
  isAuthenticated: boolean;
  theme: "light" | "dark";
  userFolderBg: string | null;
  files: FileMetadata[];
  folderCounts: Record<FileCategory, number>;
  setAuthenticated: (status: boolean) => void;
  toggleTheme: () => void;
  setFolderBg: (url: string | null) => void;
  addFile: (file: FileMetadata) => void;
  removeFile: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  theme: "dark",
  userFolderBg: null,
  files: [],
  folderCounts: {
    video: 0,
    document: 0,
    image: 0,
    other: 0,
  },
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setFolderBg: (url) => set({ userFolderBg: url }),
  addFile: (file) => set((state) => {
    const updatedFiles = [...state.files, file];
    const category = file.category;
    return {
      files: updatedFiles,
      folderCounts: {
        ...state.folderCounts,
        [category]: state.folderCounts[category] + 1
      }
    };
  }),
  removeFile: (id) => set((state) => {
    const file = state.files.find(f => f.id === id);
    if (!file) return state;
    const updatedFiles = state.files.filter(f => f.id !== id);
    const category = file.category;
    return {
      files: updatedFiles,
      folderCounts: {
        ...state.folderCounts,
        [category]: Math.max(0, state.folderCounts[category] - 1)
      }
    };
  }),
}));
