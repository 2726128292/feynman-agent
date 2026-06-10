import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  userName: string;
  spaceName: string;
  hasCompletedOnboarding: boolean;
  sidebarCollapsed: boolean;

  setUserName: (name: string) => void;
  setSpaceName: (name: string) => void;
  completeOnboarding: () => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: 'Alex',
      spaceName: '本地学习空间',
      hasCompletedOnboarding: false,
      sidebarCollapsed: false,

      setUserName: (name: string) => {
        set({ userName: name });
      },

      setSpaceName: (name: string) => {
        set({ spaceName: name });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
    }),
    {
      name: 'feynman-settings',
      partialize: (state) => ({
        userName: state.userName,
        spaceName: state.spaceName,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
