import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AdminState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "admin-store" },
  ),
);
