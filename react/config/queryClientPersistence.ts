import { get, set, del } from "idb-keyval";

/**
 * Configuración centralizada del persister de IndexedDB para React Query
 * Este persister se comparte entre todos los componentes que usan PersistQueryClientProvider
 */
export const idbPersister = {
    persistClient: async (persistedClient: any) => {
        await set('reactQuery-cache', persistedClient);
    },
    restoreClient: async () => {
        const restored = await get('reactQuery-cache');
        return restored;
    },
    removeClient: async () => {
        await del('reactQuery-cache');
    },
};

/**
 * Opciones de persistencia compartidas para todos los componentes
 */
export const persistOptions = {
    persister: idbPersister,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    buster: 'v1', // Incrementa esto para invalidar todo el caché
    dehydrateOptions: {
        shouldDehydrateQuery: () => true, // Persist all queries
    },
};
