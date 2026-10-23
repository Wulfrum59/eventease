// Le seul fichier de l'app qui parle à AsyncStorage.
// Les autres services passent par ces 3 fonctions, jamais directement par AsyncStorage.
import AsyncStorage from "@react-native-async-storage/async-storage"; // stockage clé/valeur du téléphone

import type { StorageKey } from "@/constants/storageKeys"; // le type des clés autorisées

// Lit une valeur et la retransforme en objet. Renvoie null si la clé n'existe pas encore.
export async function getItem<T>(key: StorageKey): Promise<T | null> { // <T> : le type de ce qu'on s'attend à lire
  const raw = await AsyncStorage.getItem(key); // AsyncStorage ne stocke que du texte
  if (raw === null) return null; // rien sous cette clé (premier lancement par ex.)

  try {
    // JSON.parse renvoie "any" : le "as T" c'est nous qui promettons le type à TypeScript, il ne vérifie rien
    return JSON.parse(raw) as T; // texte JSON → objet
  } catch {
    // Le texte stocké est cassé : on le dit clairement au lieu de planter plus loin sans comprendre
    throw new Error(`Données corrompues pour la clé ${key}`);
  }
}

// Transforme la valeur en texte puis l'écrit (ça écrase l'ancienne).
export async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value)); // objet → texte JSON → stockage
}

// Supprime une clé (on s'en sert à la déconnexion pour effacer la session).
export async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key); // la clé disparaît du stockage
}
