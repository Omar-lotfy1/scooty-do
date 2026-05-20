import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UiState {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  announcementDismissed: boolean
  dismissAnnouncement: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      announcementDismissed: false,
      dismissAnnouncement: () => set({ announcementDismissed: true }),
    }),
    {
      name: 'ui-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ announcementDismissed: state.announcementDismissed }), // only persist this key
    }
  )
)
