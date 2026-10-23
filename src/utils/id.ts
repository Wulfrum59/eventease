import * as Crypto from "expo-crypto"; // lib d'Expo pour tout ce qui est aléatoire et hash

// Fabrique un identifiant unique (UUID v4), genre "3b241101-e2bb-4255-8caf-4136c566a962"
export function generateId(): string {
  return Crypto.randomUUID(); // tiré au hasard, en pratique jamais deux fois le même
}
