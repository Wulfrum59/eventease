// Toutes les clés AsyncStorage de l'app, au même endroit.
// Le préfixe "@eventease/" évite les conflits avec les clés d'une autre bibliothèque.
export const STORAGE_KEYS = {
  users: "@eventease/users", // Liste de tous les comptes créés
  session: "@eventease/session", // Id de l'utilisateur connecté
  events: "@eventease/events", // Liste de tous les événements
} as const;

// Type qui n'accepte QUE les valeurs ci-dessus : "@eventease/users" | "@eventease/session" | ...
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];