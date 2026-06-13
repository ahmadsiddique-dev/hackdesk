import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  _id: string,
  email: string,
  fullName: string,
  role: string,
  organization?: string | null,
}

interface UserState {
  accessToken: string,
  user: User,
  setAuth: (accessToken: string, user: User) => void,
  clearAuth: () => void,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: '',
      user: {
        _id: '',
        email: '',
        fullName: '',
        role: '',
        organization: null,
      },
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () =>
        set({
          accessToken: '',
          user: {
            _id: '',
            email: '',
            fullName: '',
            role: '',
            organization: null,
          },
        }),
    }),
    {
      name: 'user-auth-storage',
    }
  )
)