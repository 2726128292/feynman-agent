import { create } from 'zustand';
import { getDB, ProviderConfig } from '../db/database';

interface ProviderState {
  providers: ProviderConfig[];
  activeProviderId: string | null;
  testing: boolean;
  error: string | null;

  fetchProviders: () => Promise<void>;
  addProvider: (provider: Omit<ProviderConfig, 'id' | 'created_at' | 'updated_at'>) => Promise<ProviderConfig>;
  updateProvider: (id: string, updates: Partial<ProviderConfig>) => Promise<void>;
  removeProvider: (id: string) => Promise<void>;
  setActiveProvider: (id: string | null) => Promise<void>;
  testConnection: (id: string) => Promise<boolean>;
  getActiveProvider: () => ProviderConfig | undefined;
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: [],
  activeProviderId: null,
  testing: false,
  error: null,

  fetchProviders: async () => {
    try {
      const db = await getDB();
      const allProviders = await db.getAll('providerConfigs');
      set({ providers: allProviders });

      // Set active provider if none selected
      if (!get().activeProviderId && allProviders.length > 0) {
        const activeProvider = allProviders.find((p) => p.is_active) || allProviders[0];
        set({ activeProviderId: activeProvider.id });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取 Provider 列表失败';
      set({ error: message });
    }
  },

  addProvider: async (providerData) => {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      const newProvider: ProviderConfig = {
        ...providerData,
        id: crypto.randomUUID(),
        is_active: providerData.is_active ?? false,
        created_at: now,
        updated_at: now,
      };

      await db.add('providerConfigs', newProvider);
      set((state) => ({ providers: [...state.providers, newProvider] }));

      // If this is the first provider or marked as active, set it as active
      const currentProviders = get().providers;
      if (currentProviders.length === 1 || newProvider.is_active) {
        await get().setActiveProvider(newProvider.id);
      }

      return newProvider;
    } catch (error) {
      const message = error instanceof Error ? error.message : '添加 Provider 失败';
      set({ error: message });
      throw error;
    }
  },

  updateProvider: async (id, updates) => {
    try {
      const db = await getDB();
      const existingProvider = await db.get('providerConfigs', id);

      if (!existingProvider) {
        throw new Error('Provider 不存在');
      }

      const updatedProvider: ProviderConfig = {
        ...existingProvider,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.put('providerConfigs', updatedProvider);
      set((state) => ({
        providers: state.providers.map((p) =>
          p.id === id ? updatedProvider : p
        ),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新 Provider 失败';
      set({ error: message });
      throw error;
    }
  },

  removeProvider: async (id) => {
    try {
      const db = await getDB();
      await db.delete('providerConfigs', id);

      set((state) => {
        const newProviders = state.providers.filter((p) => p.id !== id);
        const newActiveId =
          state.activeProviderId === id
            ? newProviders.find((p) => p.is_active)?.id || newProviders[0]?.id || null
            : state.activeProviderId;

        return { providers: newProviders, activeProviderId: newActiveId };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除 Provider 失败';
      set({ error: message });
      throw error;
    }
  },

  setActiveProvider: async (id) => {
    try {
      const db = await getDB();

      // Deactivate previous active provider
      const currentActiveId = get().activeProviderId;
      if (currentActiveId) {
        const prevProvider = await db.get('providerConfigs', currentActiveId);
        if (prevProvider) {
          await db.put('providerConfigs', {
            ...prevProvider,
            is_active: false,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // Activate new provider
      if (id) {
        const newProvider = await db.get('providerConfigs', id);
        if (newProvider) {
          await db.put('providerConfigs', {
            ...newProvider,
            is_active: true,
            updated_at: new Date().toISOString(),
          });
        }
      }

      set({ activeProviderId: id });

      // Update local state to reflect changes
      await get().fetchProviders();
    } catch (error) {
      const message = error instanceof Error ? error.message : '设置活跃 Provider 失败';
      set({ error: message });
      throw error;
    }
  },

  testConnection: async (id) => {
    set({ testing: true, error: null });
    try {
      const provider = get().providers.find((p) => p.id === id);
      if (!provider) {
        throw new Error('Provider 不存在');
      }

      // Simulate connection test (in real implementation, this would make an API call)
      // For now, we'll just validate that required fields are present
      if (!provider.api_key && provider.type !== 'custom') {
        throw new Error('API Key 未配置');
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({ testing: false });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : '连接测试失败';
      set({ error: message, testing: false });
      return false;
    }
  },

  getActiveProvider: () => {
    const { providers, activeProviderId } = get();
    return providers.find((p) => p.id === activeProviderId);
  },
}));
