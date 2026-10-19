// Seul fichier de l'app qui importe AsyncStorage.
// Les autres services passent par ces fonctions, jamais directement par AsyncStorage.
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { StorageKey } from "@/constants/storageKeys";

// Lit une valeur et la désérialise. Retourne null si la clé n'existe pas encore.
export async function getItem<T>(key: StorageKey): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;

  try {
    // JSON.parse retourne "any" : le "as T" est une promesse faite à TypeScript, pas une vérification
    return JSON.parse(raw) as T;
  } catch {
    // Chaîne stockée illisible : on signale clairement plutôt que de planter plus loin
    throw new Error(`Données corrompues pour la clé ${key}`);
  }
}

// Sérialise puis écrit une valeur (écrase l'ancienne).
export async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}