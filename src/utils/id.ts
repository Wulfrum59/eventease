import * as Crypto from "expo-crypto";

// Génère un identifiant unique universel (UUID v4), ex : "3b241101-e2bb-4255-8caf-4136c566a962"
export function generateId(): string {
  return Crypto.randomUUID();
}