import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type _Store = {
  token: string | null
  setToken: (token: string) => void
  removeToken: () => void
}

export const useStore = create<_Store>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      removeToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
