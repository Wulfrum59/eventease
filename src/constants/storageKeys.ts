// Toutes les clés AsyncStorage de l'app, rangées au même endroit pour ne jamais faire de faute de frappe.
// Le préfixe "@eventease/" évite de se mélanger avec les clés d'une autre lib.
export const STORAGE_KEYS = {
  users: "@eventease/users", // la liste de tous les comptes
  session: "@eventease/session", // l'id de la personne connectée
  events: "@eventease/events", // la liste de tous les événements
} as const; // as const : les valeurs sont figées, TypeScript connaît le texte exact

// Type qui accepte seulement les 3 valeurs du dessus, du coup impossible de passer une clé inventée
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
