import { create } from 'zustand';

type ModalType =
  | 'add-topic'
  | 'edit-topic'
  | 'delete-confirm'
  | 'add-provider'
  | 'edit-provider'
  | 'export'
  | 'settings'
  | null;

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  activeModal: ModalType;
  modalData?: unknown;
  toasts: Toast[];
  mobileMenuOpen: boolean;

  showModal: (modal: ModalType, data?: unknown) => void;
  hideModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeModal: null,
  modalData: undefined,
  toasts: [],
  mobileMenuOpen: false,

  showModal: (modal, data) => {
    set({ activeModal: modal, modalData: data });
  },

  hideModal: () => {
    set({ activeModal: null, modalData: undefined });
  },

  addToast: (toast) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  setMobileMenuOpen: (open) => {
    set({ mobileMenuOpen: open });
  },
}));
