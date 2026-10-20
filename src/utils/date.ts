// src/utils/date.ts
// Fonctions pures sur les dates. Les dates arrivent toujours en chaîne ISO (format de stockage).

// "2026-11-01T10:00:00.000Z" → "dim. 1 novembre 2026 à 11:00" (heure locale du téléphone)
export function formatEventDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "now" en paramètre (avec une valeur par défaut) : la fonction reste testable
// avec une date fixe, au lieu de dépendre de l'heure réelle
export function isPastDate(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).getTime() < now.getTime();
}

// Date proposée par défaut dans le formulaire : demain à 18h (heure locale)
export function getDefaultEventDate(now: Date = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 1); // Gère seul le passage au mois suivant (31 → 1er)
  date.setHours(18, 0, 0, 0);
  return date.toISOString();
}